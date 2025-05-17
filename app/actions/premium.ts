"use server"

import { createServerClient } from "@/lib/supabase/server"
import { invalidateCacheByPrefix } from "@/lib/cache"
import { getCurrentUser } from "./auth"

interface EditPasteParams {
  id: string
  title?: string
  content?: string
  language?: string
  theme?: string
}

export async function editPaste({
  id,
  title,
  content,
  language,
  theme,
}: EditPasteParams): Promise<{ success: boolean; message?: string }> {
  try {
    // Check if user is authenticated and premium
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Authentication required" }
    }

    if (!user.isPremium) {
      return { success: false, message: "Premium subscription required" }
    }

    const supabase = createServerClient()

    // Check if the user owns this paste
    const { data: paste, error: fetchError } = await supabase
      .from("pastes")
      .select("user_id")
      .eq("short_id", id)
      .single()

    if (fetchError) {
      return { success: false, message: "Snippet not found" }
    }

    // If the paste has a user_id, verify ownership
    if (paste.user_id && paste.user_id !== user.id) {
      return { success: false, message: "You don't have permission to edit this snippet" }
    }

    // Update the paste
    const { error } = await supabase
      .from("pastes")
      .update({
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        language: language !== undefined ? language : undefined,
        theme: theme !== undefined ? theme : undefined,
      })
      .eq("short_id", id)

    if (error) {
      console.error("Error updating paste:", error)
      return { success: false, message: "Failed to update snippet" }
    }

    // Invalidate caches
    invalidateCacheByPrefix("snippets")
    invalidateCacheByPrefix(id)

    return { success: true }
  } catch (error) {
    console.error("Error in editPaste:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function deletePaste(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Authentication required" }
    }

    const supabase = createServerClient()

    // Check if the user owns this paste
    const { data: paste, error: fetchError } = await supabase
      .from("pastes")
      .select("user_id")
      .eq("short_id", id)
      .single()

    if (fetchError) {
      return { success: false, message: "Snippet not found" }
    }

    // If the paste has a user_id, verify ownership
    if (paste.user_id && paste.user_id !== user.id) {
      return { success: false, message: "You don't have permission to delete this snippet" }
    }

    // Delete the paste
    const { error } = await supabase.from("pastes").delete().eq("short_id", id)

    if (error) {
      console.error("Error deleting paste:", error)
      return { success: false, message: "Failed to delete snippet" }
    }

    // Invalidate caches
    invalidateCacheByPrefix("snippets")
    invalidateCacheByPrefix("admin")

    return { success: true }
  } catch (error) {
    console.error("Error in deletePaste:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function checkIsPremiumUser(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user?.isPremium
}
