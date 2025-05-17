"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function signUp(email: string, password: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function signOut() {
  try {
    const supabase = createServerClient()
    await supabase.auth.signOut()
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function resetPassword(email: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updatePassword(password: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Get user profile data including subscription status
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    return {
      ...user,
      isPremium: profile?.subscription_status === "active",
      profile,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
