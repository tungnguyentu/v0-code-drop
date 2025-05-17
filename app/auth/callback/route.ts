import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/"

  if (code) {
    const supabase = createServerClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(new URL("/auth/auth-error", request.url))
    }
  }

  // Redirect to the requested page or home
  return NextResponse.redirect(new URL(next, origin))
}
