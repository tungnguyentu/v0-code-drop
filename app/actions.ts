"use server"

import { nanoid } from "nanoid"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CreatePasteParams {
  title: string
  content: string
  language: string
  expiration: string
  viewLimit: string
}

export async function createPaste({
  title,
  content,
  language,
  expiration,
  viewLimit,
}: CreatePasteParams): Promise<string> {
  const supabase = createServerClient()

  // Generate a short ID for the paste URL
  const shortId = nanoid(8)

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
    })
    .select("short_id")
    .single()

  if (error) {
    console.error("Error creating paste:", error)
    throw new Error("Failed to create paste")
  }

  return shortId
}

export async function getPasteById(shortId: string) {
  const supabase = createServerClient()

  // Query for the paste
  const { data: paste, error } = await supabase.from("pastes").select("*").eq("short_id", shortId).single()

  if (error || !paste) {
    console.error("Error fetching paste:", error)
    return null
  }

  // Check if paste has expired
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    // Delete expired paste
    await supabase.from("pastes").delete().eq("short_id", shortId)
    return null
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
  }
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
