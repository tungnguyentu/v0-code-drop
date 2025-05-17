"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single supabase client for the browser
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClientComponentClient<Database>()
  return clientInstance
}
