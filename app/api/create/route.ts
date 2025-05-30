import { NextResponse } from "next/server"
import { createPaste } from "@/app/actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extract data from the request body
    const { title, content, language, expiration, viewLimit, password } = body

    // Validate required fields
    if (!content) {
      return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 })
    }

    if (!language) {
      return NextResponse.json({ success: false, message: "Language is required" }, { status: 400 })
    }

    // Create the paste using the existing server action
    const result = await createPaste({
      title,
      content,
      language,
      expiration: expiration || "1d",
      viewLimit: viewLimit || "unlimited",
      password,
      theme: "vs", // Default theme since it's not provided by the extension
    })

    // Return the created paste ID and owner code
    return NextResponse.json({
      success: true,
      shortId: result.shortId,
      ownerCode: result.ownerCode,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Error creating snippet:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred while creating the snippet",
      },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS", 
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}

// Add OPTIONS method to handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
