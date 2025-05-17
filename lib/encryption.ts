import crypto from "crypto"

// The encryption key should be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const ENCRYPTION_ALGORITHM = "aes-256-gcm"

/**
 * Ensures the encryption key is valid and properly formatted
 * @returns Buffer containing the encryption key
 */
function getEncryptionKey(): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY environment variable is not set")
  }

  // If the key is already 32 bytes, use it directly
  if (Buffer.from(ENCRYPTION_KEY).length === 32) {
    return Buffer.from(ENCRYPTION_KEY)
  }

  // Otherwise, derive a 32-byte key using SHA-256
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest()
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
  try {
    // Get the properly formatted encryption key
    const key = getEncryptionKey()

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16)

    // Create cipher
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv)

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
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt content")
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
    // Get the properly formatted encryption key
    const key = getEncryptionKey()

    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, Buffer.from(iv, "hex"))

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
