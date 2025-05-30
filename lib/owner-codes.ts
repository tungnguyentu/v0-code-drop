import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"

/**
 * Generate a secure owner code (12 characters)
 * Format: OWN-ABC123DEF456
 */
export function generateOwnerCode(): string {
  return `OWN-${nanoid(9).toUpperCase()}`
}

/**
 * Generate a secure edit code (8 characters)
 * Format: EDIT-XXXXXX
 */
export function generateEditCode(): string {
  return `EDIT-${nanoid(6).toUpperCase()}`
}

/**
 * Generate a secure delete code (8 characters)
 * Format: DEL-XXXXXX
 */
export function generateDeleteCode(): string {
  return `DEL-${nanoid(6).toUpperCase()}`
}

/**
 * Hash a code for secure storage in the database
 */
export async function hashCode(code: string): Promise<string> {
  return await bcrypt.hash(code, 10)
}

/**
 * Verify an input code against a hashed code
 */
export async function verifyCode(inputCode: string, hashedCode: string): Promise<boolean> {
  return await bcrypt.compare(inputCode, hashedCode)
}

/**
 * Generate all three codes for a new snippet
 */
export function generateAllCodes() {
  return {
    ownerCode: generateOwnerCode(),
    editCode: generateEditCode(),
    deleteCode: generateDeleteCode(),
  }
}

/**
 * Determine the type of code based on its prefix
 */
export function getCodeType(code: string): 'owner' | 'edit' | 'delete' | 'unknown' {
  if (code.startsWith('OWNER-')) return 'owner'
  if (code.startsWith('EDIT-')) return 'edit'
  if (code.startsWith('DEL-')) return 'delete'
  return 'unknown'
}

/**
 * Validate owner code format
 */
export function isValidOwnerCodeFormat(code: string): boolean {
  const ownerPattern = /^OWN-[A-Z0-9]{9}$/
  return ownerPattern.test(code)
}

/**
 * Validate code format
 */
export function isValidCodeFormat(code: string): boolean {
  const ownerPattern = /^OWN-[A-Z0-9]{9}$/
  const editPattern = /^EDIT-[A-Z0-9]{6}$/
  const deletePattern = /^DEL-[A-Z0-9]{6}$/
  
  return ownerPattern.test(code) || editPattern.test(code) || deletePattern.test(code)
} 