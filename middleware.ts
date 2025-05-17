import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired - this will set the refresh token as a cookie
  const { data: { session }, error } = await supabase.auth.getSession()

  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Skip auth check for login page and API routes
  if (path === "/admin/login" || path.startsWith("/api/")) {
    return res
  }

  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {
    const sessionToken = request.cookies.get("admin_session")?.value

    // If no session token, redirect to login
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Check if the path starts with /account
  if (path.startsWith("/account")) {
    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return res
}

// Configure the paths that should be processed by this middleware
export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/auth/callback"]
}