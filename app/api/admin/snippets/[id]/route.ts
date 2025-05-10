import { type NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the user is authenticated
    const isAdmin = await isAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    if (!id) {
      return NextResponse.json({ success: false, message: "Snippet ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await supabase.from("pastes").delete().eq("short_id", id)

    if (error) {
      console.error("Error deleting snippet:", error)
      return NextResponse.json({ success: false, message: "Failed to delete snippet" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete snippet error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
