import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Create a single supabase client for the browser
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const createBrowserClient = () => {
  // If we already have an instance, return it
  if (clientInstance) return clientInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Create a new instance and store it
  clientInstance = createClient<Database>(supabaseUrl, supabaseKey)
  return clientInstance
}

// Export a singleton instance getter
export const getSupabaseBrowserClient = () => {
  return createBrowserClient()
}
