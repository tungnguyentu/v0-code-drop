import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

// In a real application, this would be stored securely in a database
// For this example, we're using environment variables
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "codin-admin-2024"

// Simple session token generation
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Check if the user is authenticated
export async function isAuthenticated() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("admin_session")?.value

  if (!sessionToken) {
    return false
  }

  // In a real app, you would validate this token against a database
  // For this example, we'll just check if it exists in our sessions table
  const supabase = createServerClient()
  const { data, error } = await supabase.from("admin_sessions").select("*").eq("token", sessionToken).single()

  if (error || !data) {
    return false
  }

  // Check if the session is expired
  const now = new Date()
  const expiresAt = new Date(data.expires_at)
  if (now > expiresAt) {
    // Delete expired session
    await supabase.from("admin_sessions").delete().eq("token", sessionToken)
    return false
  }

  return true
}

// Authenticate the admin
export async function authenticateAdmin(username: string, password: string) {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, message: "Invalid credentials" }
  }

  const token = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

  // Store the session
  const supabase = createServerClient()
  const { error } = await supabase.from("admin_sessions").insert({
    token,
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error("Error creating session:", error)
    return { success: false, message: "Failed to create session" }
  }

  // Set the session cookie
  cookies().set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })

  return { success: true }
}

// Logout the admin
export async function logoutAdmin() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("admin_session")?.value

  if (sessionToken) {
    // Delete the session from the database
    const supabase = createServerClient()
    await supabase.from("admin_sessions").delete().eq("token", sessionToken)
  }

  // Clear the cookie
  cookies().delete("admin_session")
}

// Middleware to protect admin routes
export async function requireAdmin() {
  const isAdmin = await isAuthenticated()
  if (!isAdmin) {
    redirect("/admin/login")
  }
}
