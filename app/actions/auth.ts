"use server"
import { createServerClient } from "@/lib/supabase/server"

export async function signUp(email: string, password: string) {
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
}

export async function signIn(email: string, password: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  // Remove the redirect call and return success instead
  return { success: true }
}

export async function resetPassword(email: string) {
  const supabase = createServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updatePassword(password: string) {
  const supabase = createServerClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getCurrentUser() {
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
}
