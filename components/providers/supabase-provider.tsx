"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type SupabaseContextType = {
  user: User | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  isLoading: true,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Check for existing session
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    checkUser()
  }, [])

  return <SupabaseContext.Provider value={{ user, isLoading }}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => useContext(SupabaseContext)
