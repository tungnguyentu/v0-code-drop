import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert database expires_at to dropdown option
export function getExpiryOption(expiresAt: string | null): string {
  if (!expiresAt) return "never"
  
  const expiryDate = new Date(expiresAt)
  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  
  // Return the closest matching option
  if (diffMinutes <= 5) return "5m"
  if (diffHours <= 1) return "1h"
  if (diffDays <= 1) return "1d"
  if (diffDays <= 7) return "1w"
  return "never"
}

// Helper function to convert database view_limit to dropdown option
export function getViewLimitOption(viewLimit: string): string {
  return viewLimit // Already in correct format
}

// Helper function to calculate new expiry date from selected option
export function calculateNewExpiryDate(option: string): Date | null {
  if (option === "never") return null
  
  const now = new Date()
  if (option === "5m") {
    now.setMinutes(now.getMinutes() + 5)
  } else if (option === "1h") {
    now.setHours(now.getHours() + 1)
  } else if (option === "1d") {
    now.setDate(now.getDate() + 1)
  } else if (option === "1w") {
    now.setDate(now.getDate() + 7)
  }
  
  return now
}

// Helper function to validate view limit change
export function validateViewLimitChange(currentViewCount: number, newLimit: string): { valid: boolean; message?: string } {
  if (newLimit === "unlimited") return { valid: true }
  
  const newLimitNum = parseInt(newLimit)
  if (currentViewCount > newLimitNum) {
    return {
      valid: false,
      message: `Cannot set limit below current view count (${currentViewCount} views)`
    }
  }
  
  return { valid: true }
}
