import { NextResponse } from "next/server"
import { encryptText, decryptText } from "@/lib/encryption"

export async function GET() {
  try {
    // Test if encryption is working
    const testText = "This is a test message for encryption"

    // Try to encrypt
    const { encryptedText, iv, authTag } = encryptText(testText)

    // Try to decrypt
    const decryptedText = decryptText(encryptedText, iv, authTag)

    // Check if decryption worked
    const success = decryptedText === testText

    return NextResponse.json({
      success,
      encryptionKeyExists: !!process.env.ENCRYPTION_KEY,
      encryptionKeyLength: process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY).length : 0,
      testText,
      encryptedText: encryptedText.substring(0, 20) + "...", // Only show part for security
      decryptedText,
      iv,
      authTag,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
