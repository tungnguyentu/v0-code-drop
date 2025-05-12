"use server"

import { createServerClient } from "@/lib/supabase/server"
import { getCachedData, setCachedData, isCacheValid, invalidateCache } from "@/lib/cache"

const CACHE_TTL = 30 // 30 seconds cache

export async function getSnippetsList() {
  const cacheKey = "snippets-list"

  // Check if we have valid cached data
  if (isCacheValid(cacheKey)) {
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return cachedData
    }
  }

  // If no valid cache, fetch from database
  const supabase = createServerClient()

  const { data: snippets, error } = await supabase
    .from("pastes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching snippets:", error)
    return []
  }

  // Cache the result
  setCachedData(cacheKey, snippets || [], { ttl: CACHE_TTL })

  return snippets || []
}

export async function invalidateSnippetsCache() {
  invalidateCache("snippets-list")
}
