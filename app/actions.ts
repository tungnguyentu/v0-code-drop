"use server"

import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { invalidateCacheByPrefix } from "@/lib/cache"
import { generateOwnerCode, hashCode, verifyCode, isValidOwnerCodeFormat } from "@/lib/owner-codes"
import { calculateNewExpiryDate, validateViewLimitChange } from "@/lib/utils"

interface CreatePasteParams {
  title: string
  content: string
  language: string
  expiration: string
  viewLimit: string
  password?: string
  theme: string
}

interface CreatePasteResult {
  shortId: string
  ownerCode: string
}

export async function createPaste({
  title,
  content,
  language,
  expiration,
  viewLimit,
  password,
  theme,
}: CreatePasteParams): Promise<CreatePasteResult> {
  const supabase = createServerClient()

  // Generate a short ID for the paste URL
  const shortId = nanoid(8)

  // Generate owner code
  const ownerCode = generateOwnerCode()
  const ownerCodeHash = await hashCode(ownerCode)

  // Calculate expiration date
  let expiresAt = null
  if (expiration !== "never") {
    const now = new Date()
    if (expiration === "5m") now.setMinutes(now.getMinutes() + 5)
    if (expiration === "1h") now.setHours(now.getHours() + 1)
    if (expiration === "1d") now.setDate(now.getDate() + 1)
    if (expiration === "1w") now.setDate(now.getDate() + 7)
    expiresAt = now.toISOString()
  }

  // Handle password protection
  let passwordHash = null
  let isProtected = false

  if (password && password.trim()) {
    passwordHash = await bcrypt.hash(password, 10)
    isProtected = true
  }

  // Create the paste in the database
  const { data, error } = await supabase
    .from("pastes")
    .insert({
      short_id: shortId,
      title: title || null,
      content,
      language,
      expires_at: expiresAt,
      view_limit: viewLimit,
      view_count: 0,
      password_hash: passwordHash,
      is_protected: isProtected,
      theme,
      owner_code: ownerCodeHash,
      created_ip: null, // Could be populated from headers if needed
    })
    .select("short_id")
    .single()

  if (error) {
    console.error("Error creating paste:", error)
    throw new Error("Failed to create paste")
  }

  // Invalidate caches
  invalidateCacheByPrefix("admin")
  invalidateCacheByPrefix("snippets")

  return {
    shortId,
    ownerCode,
  }
}

export async function getPasteById(shortId: string) {
  const supabase = createServerClient()

  // Query for the paste
  const { data: pastes, error } = await supabase.from("pastes").select("*").eq("short_id", shortId)

  if (error) {
    console.error("Error fetching paste:", error)
    return null
  }

  // If no paste found, return null
  if (!pastes || pastes.length === 0) {
    return null
  }

  const paste = pastes[0]

  // Check if paste has expired
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    // Delete expired paste
    await supabase.from("pastes").delete().eq("short_id", shortId)
    return null
  }

  // Check if the paste is password protected
  if (paste.is_protected) {
    // Check if the user has already verified the password for this paste
    const cookieStore = await cookies()
    const verifiedPastes = cookieStore.get(`verified_paste_${shortId}`)?.value

    if (!verifiedPastes) {
      // Return limited info for password verification
      return {
        id: paste.short_id,
        title: paste.title || "",
        isProtected: true,
        language: paste.language,
      }
    }
  }

  // Check if view limit has been reached
  if (paste.view_limit !== "unlimited") {
    const newViewCount = paste.view_count + 1

    if (newViewCount > Number.parseInt(paste.view_limit)) {
      // Delete paste if view limit exceeded
      await supabase.from("pastes").delete().eq("short_id", shortId)
      return null
    }

    // Update view count
    await supabase.from("pastes").update({ view_count: newViewCount }).eq("short_id", shortId)

    paste.view_count = newViewCount
  }

  // Format the paste for frontend use
  return {
    id: paste.short_id,
    title: paste.title || "",
    content: paste.content,
    language: paste.language,
    createdAt: paste.created_at,
    expiresAt: paste.expires_at,
    viewLimit: paste.view_limit,
    viewCount: paste.view_count,
    isProtected: paste.is_protected,
    theme: paste.theme || "vs",
  }
}

export async function verifyPastePassword(shortId: string, password: string): Promise<boolean> {
  const supabase = createServerClient()

  // Query for the paste
  const { data: pastes, error } = await supabase.from("pastes").select("password_hash").eq("short_id", shortId)

  if (error || !pastes || pastes.length === 0) {
    return false
  }

  const paste = pastes[0]

  // Verify the password
  const isValid = await bcrypt.compare(password, paste.password_hash || "")

  if (isValid) {
    // Set a cookie to remember that this paste has been verified
    const cookieStore = await cookies()
    cookieStore.set(`verified_paste_${shortId}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  }

  return isValid
}

// Verify owner code
export async function verifyOwnerCode(snippetId: string, ownerCode: string): Promise<boolean> {
  if (!isValidOwnerCodeFormat(ownerCode)) {
    return false
  }

  const supabase = createServerClient()

  const { data: pastes, error } = await supabase
    .from("pastes")
    .select("owner_code")
    .eq("short_id", snippetId)

  if (error || !pastes || pastes.length === 0) {
    return false
  }

  const hashedCode = pastes[0].owner_code
  return await verifyCode(ownerCode, hashedCode)
}

// Get snippet for editing (requires owner code)
export async function getSnippetForEdit(snippetId: string, ownerCode: string) {
  // First verify the owner code
  const isValidOwner = await verifyOwnerCode(snippetId, ownerCode)
  if (!isValidOwner) {
    return null
  }

  const supabase = createServerClient()

  const { data: pastes, error } = await supabase
    .from("pastes")
    .select("*")
    .eq("short_id", snippetId)

  if (error || !pastes || pastes.length === 0) {
    return null
  }

  const paste = pastes[0]

  return {
    id: paste.short_id,
    title: paste.title || "",
    content: paste.content,
    language: paste.language,
    theme: paste.theme || "vs",
    createdAt: paste.created_at,
    expiresAt: paste.expires_at,
    viewLimit: paste.view_limit,
    viewCount: paste.view_count,
    isProtected: paste.is_protected,
  }
}

// Update existing snippet
export async function updateSnippet(
  snippetId: string,
  ownerCode: string,
  updatedData: {
    title?: string
    content?: string
    language?: string
    theme?: string
    expiryOption?: string
    viewLimitOption?: string
  }
): Promise<{ success: boolean; message?: string }> {
  // Verify owner code
  const isValidOwner = await verifyOwnerCode(snippetId, ownerCode)
  if (!isValidOwner) {
    return { success: false, message: "Invalid owner code" }
  }

  const supabase = createServerClient()

  // Get current snippet data for validation
  const { data: currentPaste, error: fetchError } = await supabase
    .from("pastes")
    .select("view_count, view_limit")
    .eq("short_id", snippetId)
    .single()

  if (fetchError || !currentPaste) {
    return { success: false, message: "Snippet not found" }
  }

  // Validate view limit change if provided
  if (updatedData.viewLimitOption) {
    const validation = validateViewLimitChange(currentPaste.view_count, updatedData.viewLimitOption)
    if (!validation.valid) {
      return { success: false, message: validation.message }
    }
  }

  const updateFields: any = {}
  if (updatedData.title !== undefined) updateFields.title = updatedData.title || null
  if (updatedData.content !== undefined) updateFields.content = updatedData.content
  if (updatedData.language !== undefined) updateFields.language = updatedData.language
  if (updatedData.theme !== undefined) updateFields.theme = updatedData.theme
  
  // Handle expiry option
  if (updatedData.expiryOption !== undefined) {
    const newExpiryDate = calculateNewExpiryDate(updatedData.expiryOption)
    updateFields.expires_at = newExpiryDate ? newExpiryDate.toISOString() : null
  }
  
  // Handle view limit option
  if (updatedData.viewLimitOption !== undefined) {
    updateFields.view_limit = updatedData.viewLimitOption
  }

  const { error } = await supabase
    .from("pastes")
    .update(updateFields)
    .eq("short_id", snippetId)

  if (error) {
    console.error("Error updating snippet:", error)
    return { success: false, message: "Failed to update snippet" }
  }

  // Invalidate caches
  invalidateCacheByPrefix("snippets")
  invalidateCacheByPrefix(snippetId)

  return { success: true }
}

// Delete snippet
export async function deleteSnippet(
  snippetId: string,
  ownerCode: string
): Promise<{ success: boolean; message?: string }> {
  // Verify owner code
  const isValidOwner = await verifyOwnerCode(snippetId, ownerCode)
  if (!isValidOwner) {
    return { success: false, message: "Invalid owner code" }
  }

  const supabase = createServerClient()

  const { error } = await supabase
    .from("pastes")
    .delete()
    .eq("short_id", snippetId)

  if (error) {
    console.error("Error deleting snippet:", error)
    return { success: false, message: "Failed to delete snippet" }
  }

  // Invalidate caches
  invalidateCacheByPrefix("snippets")
  invalidateCacheByPrefix(snippetId)

  return { success: true }
}

// Clean up expired pastes
export async function cleanupExpiredPastes() {
  const supabase = createServerClient()

  const { error } = await supabase.from("pastes").delete().lt("expires_at", new Date().toISOString())

  if (error) {
    console.error("Error cleaning up expired pastes:", error)
  }

  revalidatePath("/")
}
