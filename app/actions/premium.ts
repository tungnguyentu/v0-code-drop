"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { invalidateCacheByPrefix } from "@/lib/cache"
import { encryptText } from "@/lib/encryption"

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
    // In a real app, check if the user is premium and owns this paste
    const isPremium = await checkIsPremiumUser()
    if (!isPremium) {
      return { success: false, message: "Premium subscription required" }
    }

    const supabase = createServerClient()

    // Prepare update data
    const updateData: any = {}

    if (title !== undefined) {
      updateData.title = title
    }

    if (language !== undefined) {
      updateData.language = language
    }

    if (theme !== undefined) {
      updateData.theme = theme
    }

    // If content is being updated, encrypt it
    if (content !== undefined) {
      const { encryptedText, iv, authTag } = encryptText(content)
      updateData.content = encryptedText
      updateData.content_iv = iv
      updateData.content_auth_tag = authTag
      updateData.is_encrypted = true
    }

    // Update the paste
    const { error } = await supabase.from("pastes").update(updateData).eq("short_id", id)

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

// Update the deletePaste function to allow all users to delete snippets
export async function deletePaste(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Remove the premium check for deletion
    // const isPremium = await checkIsPremiumUser();
    // if (!isPremium) {
    //   return { success: false, message: "Premium subscription required" };
    // }

    const supabase = createServerClient()

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

// Mock function to check if user is premium
// In a real app, this would check the user's subscription status in the database
async function checkIsPremiumUser(): Promise<boolean> {
  // For demo purposes, we'll use a cookie to simulate premium status
  const cookieStore = cookies()
  const premiumStatus = cookieStore.get("premium_status")?.value

  return premiumStatus === "active"
}

// Function to set premium status (for demo purposes)
export async function setPremiumStatus(status: "active" | "inactive"): Promise<void> {
  cookies().set("premium_status", status, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
}
