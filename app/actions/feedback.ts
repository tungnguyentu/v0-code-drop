"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface SubmitFeedbackParams {
  type: string
  message: string
  email?: string
}

export async function submitFeedback({
  type,
  message,
  email,
}: SubmitFeedbackParams): Promise<{ success: boolean; message: string }> {
  if (!message.trim()) {
    return { success: false, message: "Feedback message is required" }
  }

  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("feedback").insert({
      type,
      message,
      email: email || null,
    })

    if (error) {
      console.error("Error submitting feedback:", error)
      return { success: false, message: "Failed to submit feedback" }
    }

    return { success: true, message: "Thank you for your feedback!" }
  } catch (error) {
    console.error("Error in submitFeedback:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function getFeedbackList(status?: string) {
  try {
    const supabase = createServerClient()

    let query = supabase.from("feedback").select("*").order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching feedback:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeedbackList:", error)
    return []
  }
}

export async function updateFeedbackStatus(id: string, status: string, isRead = true) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("feedback").update({ status, is_read: isRead }).eq("id", id)

    if (error) {
      console.error("Error updating feedback status:", error)
      return false
    }

    revalidatePath("/admin/feedback")
    return true
  } catch (error) {
    console.error("Error in updateFeedbackStatus:", error)
    return false
  }
}

export async function deleteFeedback(id: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("feedback").delete().eq("id", id)

    if (error) {
      console.error("Error deleting feedback:", error)
      return false
    }

    revalidatePath("/admin/feedback")
    return true
  } catch (error) {
    console.error("Error in deleteFeedback:", error)
    return false
  }
}
