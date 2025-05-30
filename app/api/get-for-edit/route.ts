import { NextRequest, NextResponse } from "next/server"
import { getSnippetForEdit } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const { snippetId, ownerCode } = await request.json()

    if (!snippetId || !ownerCode) {
      return NextResponse.json(
        { success: false, message: "Snippet ID and owner code are required" },
        { status: 400 }
      )
    }

    const snippet = await getSnippetForEdit(snippetId, ownerCode)

    if (!snippet) {
      return NextResponse.json(
        { success: false, message: "Snippet not found or invalid owner code" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      snippet
    })

  } catch (error) {
    console.error("Error getting snippet for edit:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 