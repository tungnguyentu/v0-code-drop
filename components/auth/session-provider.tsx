"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type UserProfile = {
  subscription_status: string | null
  subscription_end_date: string | null
}

type AuthContextType = {
  session: Session | null
  user: (User & { isPremium: boolean; profile: UserProfile | null }) | null
  isLoading: boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  refreshSession: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<(User & { isPremium: boolean; profile: UserProfile | null }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)

      if (currentSession?.user) {
        // Get user profile data
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", currentSession.user.id)
          .single()

        // Set user with premium status
        setUser({
          ...currentSession.user,
          isPremium: profile?.subscription_status === "active",
          profile: profile || null,
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial session check
    refreshSession()

    // Set up auth state change listener
    const supabase = getSupabaseBrowserClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await refreshSession()
      } else if (event === "SIGNED_OUT") {
        setSession(null)
        setUser(null)
      }
    })

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}