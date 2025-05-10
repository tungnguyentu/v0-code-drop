import { NextResponse } from "next/server"
import { cleanupExpiredPastes } from "@/app/actions"

// This route can be called by a cron job to clean up expired pastes
export async function GET() {
  try {
    await cleanupExpiredPastes()
    return NextResponse.json({ success: true, message: "Cleanup completed" })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json({ success: false, message: "Cleanup failed" }, { status: 500 })
  }
}
