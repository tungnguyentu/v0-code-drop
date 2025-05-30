import { NextRequest, NextResponse } from "next/server"
import { verifyOwnerCode } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const { snippetId, ownerCode } = await request.json()

    if (!snippetId || !ownerCode) {
      return NextResponse.json(
        { success: false, message: "Snippet ID and owner code are required" },
        { status: 400 }
      )
    }

    const isValid = await verifyOwnerCode(snippetId, ownerCode)

    return NextResponse.json({
      success: true,
      valid: isValid,
      message: isValid ? "Owner code verified" : "Invalid owner code"
    })

  } catch (error) {
    console.error("Error verifying owner code:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 