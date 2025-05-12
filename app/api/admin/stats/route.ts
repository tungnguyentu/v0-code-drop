import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { getCachedData, setCachedData, isCacheValid } from "@/lib/cache"

// Cache TTL in seconds
const CACHE_TTL = 60 // 1 minute

export async function GET() {
  try {
    // Check if the user is authenticated
    const isAdmin = await isAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const cacheKey = "admin-dashboard-stats"

    // Check if we have valid cached data
    if (isCacheValid(cacheKey)) {
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        // Return cached data with cache header
        return NextResponse.json(cachedData, {
          headers: {
            "Cache-Control": `public, max-age=${CACHE_TTL}`,
          },
        })
      }
    }

    const supabase = createServerClient()

    // Get total snippets count
    const { count: totalSnippets } = await supabase.from("pastes").select("*", { count: "exact", head: true })

    // Get active snippets count (not expired)
    const { count: activeSnippets } = await supabase
      .from("pastes")
      .select("*", { count: "exact", head: true })
      .or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`)

    // Get snippets created in the last 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    const { count: recentSnippets } = await supabase
      .from("pastes")
      .select("*", { count: "exact", head: true })
      .gt("created_at", oneDayAgo.toISOString())

    // Get most viewed snippets
    const { data: mostViewed } = await supabase
      .from("pastes")
      .select("short_id, title, view_count")
      .order("view_count", { ascending: false })
      .limit(5)

    const responseData = {
      totalSnippets: totalSnippets || 0,
      activeSnippets: activeSnippets || 0,
      recentSnippets: recentSnippets || 0,
      mostViewed: mostViewed || [],
    }

    // Cache the result
    setCachedData(cacheKey, responseData, { ttl: CACHE_TTL })

    // Return the data with cache header
    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
