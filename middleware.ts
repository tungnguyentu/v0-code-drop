import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Create a response object
  const res = NextResponse.next()

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

  return res
}

// Configure the paths that should be processed by this middleware
export const config = {
  matcher: ["/admin/:path*"],
}
