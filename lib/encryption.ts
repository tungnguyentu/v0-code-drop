import crypto from "crypto"

// The encryption key should be stored in environment variables in production
// For this example, we'll use a fixed key, but in a real application, use process.env.ENCRYPTION_KEY
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secure-encryption-key-must-be-32-chars"
const ENCRYPTION_ALGORITHM = "aes-256-gcm"

// Ensure the key is the correct length for AES-256
if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
  console.warn("Warning: Encryption key is not 32 bytes long. This may cause issues with encryption/decryption.")
}

/**
 * Encrypts a string using AES-256-GCM
 * @param text The text to encrypt
 * @returns An object containing the encrypted text, initialization vector, and auth tag
 */
export function encryptText(text: string): {
  encryptedText: string
  iv: string
  authTag: string
} {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16)

  // Create cipher
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Get the authentication tag
  const authTag = cipher.getAuthTag().toString("hex")

  return {
    encryptedText: encrypted,
    iv: iv.toString("hex"),
    authTag,
  }
}

/**
 * Decrypts a string that was encrypted using AES-256-GCM
 * @param encryptedText The encrypted text
 * @param iv The initialization vector used for encryption
 * @param authTag The authentication tag from encryption
 * @returns The decrypted text
 */
export function decryptText(encryptedText: string, iv: string, authTag: string): string {
  try {
    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, "hex"))

    // Set auth tag
    decipher.setAuthTag(Buffer.from(authTag, "hex"))

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt content")
  }
}
