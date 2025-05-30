import { NextRequest, NextResponse } from "next/server"
import { deleteSnippet } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const { snippetId, ownerCode } = await request.json()

    if (!snippetId || !ownerCode) {
      return NextResponse.json(
        { success: false, message: "Snippet ID and owner code are required" },
        { status: 400 }
      )
    }

    const result = await deleteSnippet(snippetId, ownerCode)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to delete snippet" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Snippet deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting snippet:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 