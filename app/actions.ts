"use server"

import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { invalidateCacheByPrefix } from "@/lib/cache"

interface CreatePasteParams {
  title: string
  content: string
  language: string
  expiration: string
  viewLimit: string
  password?: string
  theme: string
}

export async function createPaste({
  title,
  content,
  language,
  expiration,
  viewLimit,
  password,
  theme,
}: CreatePasteParams): Promise<{ shortId: string; deletionKey: string }> {
  const supabase = createServerClient()

  // Generate a short ID for the paste URL
  const shortId = nanoid(8)

  // Generate a deletion key
  const deletionKey = nanoid(16)

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
    // Hash the password with bcrypt
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
      deletion_key: deletionKey,
    })
    .select("short_id")
    .single()

  if (error) {
    console.error("Error creating paste:", error)
    throw new Error("Failed to create paste")
  }

  // Invalidate all admin-related caches when a new paste is created
  invalidateCacheByPrefix("admin")
  invalidateCacheByPrefix("snippets")

  return { shortId, deletionKey }
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
    const cookieStore = cookies()
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
    cookies().set(`verified_paste_${shortId}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  }

  return isValid
}

// Add a new action to delete a paste with a deletion key
export async function deletePasteWithKey(
  shortId: string,
  deletionKey: string,
): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient()

  // First, verify the deletion key
  const { data: pastes, error: fetchError } = await supabase
    .from("pastes")
    .select("deletion_key")
    .eq("short_id", shortId)
    .single()

  if (fetchError || !pastes) {
    return { success: false, message: "Snippet not found" }
  }

  // Check if the deletion key matches
  if (pastes.deletion_key !== deletionKey) {
    return { success: false, message: "Invalid deletion key" }
  }

  // Delete the paste
  const { error: deleteError } = await supabase.from("pastes").delete().eq("short_id", shortId)

  if (deleteError) {
    console.error("Error deleting paste:", deleteError)
    return { success: false, message: "Failed to delete snippet" }
  }

  // Invalidate caches
  invalidateCacheByPrefix("admin")
  invalidateCacheByPrefix("snippets")

  return { success: true, message: "Snippet deleted successfully" }
}

// Add a helper function to clean up expired pastes
export async function cleanupExpiredPastes() {
  const supabase = createServerClient()

  const { error } = await supabase.from("pastes").delete().lt("expires_at", new Date().toISOString())

  if (error) {
    console.error("Error cleaning up expired pastes:", error)
  }

  revalidatePath("/")
}
