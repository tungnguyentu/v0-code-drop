"use client"

import { useAuth } from "@/components/auth/session-provider"

export function useCurrentUser() {
  const { user, isLoading, refreshSession } = useAuth()

  return {
    user,
    isLoading,
    refreshSession,
    isAuthenticated: !!user,
    isPremium: !!user?.isPremium,
  }
}
