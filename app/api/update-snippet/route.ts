import { NextRequest, NextResponse } from "next/server"
import { updateSnippet } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const { 
      snippetId, 
      ownerCode, 
      title, 
      content, 
      language, 
      theme,
      expiryOption,
      viewLimitOption
    } = await request.json()

    if (!snippetId || !ownerCode) {
      return NextResponse.json(
        { success: false, message: "Snippet ID and owner code are required" },
        { status: 400 }
      )
    }

    const result = await updateSnippet(snippetId, ownerCode, {
      title,
      content,
      language,
      theme,
      expiryOption,
      viewLimitOption
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to update snippet" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Snippet updated successfully"
    })

  } catch (error) {
    console.error("Error updating snippet:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 