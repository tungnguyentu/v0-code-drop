import { type NextRequest, NextResponse } from "next/server"
import { logoutAdmin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await logoutAdmin()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during logout" }, { status: 500 })
  }
}
