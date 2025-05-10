"use server"

import { createServerClient } from "@/lib/supabase/server"

// Get total counts for dashboard
export async function getAnalyticsCounts() {
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
  const { count: last24Hours } = await supabase
    .from("pastes")
    .select("*", { count: "exact", head: true })
    .gt("created_at", oneDayAgo.toISOString())

  // Get snippets created in the last 7 days
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const { count: last7Days } = await supabase
    .from("pastes")
    .select("*", { count: "exact", head: true })
    .gt("created_at", oneWeekAgo.toISOString())

  // Get total views
  const { data: viewsData } = await supabase.from("pastes").select("view_count")

  const totalViews = viewsData?.reduce((sum, paste) => sum + paste.view_count, 0) || 0

  return {
    totalSnippets: totalSnippets || 0,
    activeSnippets: activeSnippets || 0,
    last24Hours: last24Hours || 0,
    last7Days: last7Days || 0,
    totalViews: totalViews,
  }
}

// Get language distribution
export async function getLanguageDistribution() {
  const supabase = createServerClient()

  const { data } = await supabase.from("pastes").select("language")

  if (!data || data.length === 0) {
    return []
  }

  // Count occurrences of each language
  const languageCounts: Record<string, number> = {}
  data.forEach((paste) => {
    const lang = paste.language
    languageCounts[lang] = (languageCounts[lang] || 0) + 1
  })

  // Convert to array and sort by count
  const result = Object.entries(languageCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Sort by count descending
  return result.sort((a, b) => b.value - a.value)
}

// Get creation trend data (snippets created per day for the last 30 days)
export async function getCreationTrend() {
  const supabase = createServerClient()

  // Get snippets from the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data } = await supabase
    .from("pastes")
    .select("created_at")
    .gt("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  if (!data || data.length === 0) {
    return []
  }

  // Group by day
  const dailyCounts: Record<string, number> = {}

  // Initialize all days in the last 30 days with 0
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]
    dailyCounts[dateString] = 0
  }

  // Count snippets per day
  data.forEach((paste) => {
    const dateString = new Date(paste.created_at).toISOString().split("T")[0]
    dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1
  })

  // Convert to array and sort by date
  const result = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }))

  // Sort by date ascending
  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Get view limit distribution
export async function getViewLimitDistribution() {
  const supabase = createServerClient()

  const { data } = await supabase.from("pastes").select("view_limit")

  if (!data || data.length === 0) {
    return []
  }

  // Count occurrences of each view limit
  const viewLimitCounts: Record<string, number> = {}
  data.forEach((paste) => {
    const limit = paste.view_limit
    viewLimitCounts[limit] = (viewLimitCounts[limit] || 0) + 1
  })

  // Convert to array and sort by count
  const result = Object.entries(viewLimitCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Sort by count descending
  return result.sort((a, b) => b.value - a.value)
}

// Get expiration distribution
export async function getExpirationDistribution() {
  const supabase = createServerClient()

  const { data } = await supabase.from("pastes").select("expires_at")

  if (!data || data.length === 0) {
    return []
  }

  // Categorize expirations
  let never = 0
  let lessThanDay = 0
  let lessThanWeek = 0
  let moreThanWeek = 0

  const now = new Date()

  data.forEach((paste) => {
    if (!paste.expires_at) {
      never++
      return
    }

    const expiresAt = new Date(paste.expires_at)
    const diffTime = expiresAt.getTime() - now.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)

    if (diffDays < 0) {
      // Already expired, skip
      return
    } else if (diffDays < 1) {
      lessThanDay++
    } else if (diffDays < 7) {
      lessThanWeek++
    } else {
      moreThanWeek++
    }
  })

  return [
    { name: "Never", value: never },
    { name: "< 1 day", value: lessThanDay },
    { name: "< 1 week", value: lessThanWeek },
    { name: "> 1 week", value: moreThanWeek },
  ]
}

// Get most viewed snippets
export async function getMostViewedSnippets(limit = 10) {
  const supabase = createServerClient()

  const { data } = await supabase
    .from("pastes")
    .select("short_id, title, language, view_count, created_at")
    .order("view_count", { ascending: false })
    .limit(limit)

  return data || []
}

// Get hourly creation distribution (which hours of the day are most popular)
export async function getHourlyDistribution() {
  const supabase = createServerClient()

  const { data } = await supabase.from("pastes").select("created_at")

  if (!data || data.length === 0) {
    return []
  }

  // Count snippets created in each hour of the day
  const hourlyCounts = Array(24).fill(0)

  data.forEach((paste) => {
    const hour = new Date(paste.created_at).getUTCHours()
    hourlyCounts[hour]++
  })

  // Convert to array of objects
  return hourlyCounts.map((count, hour) => ({
    hour: hour.toString(),
    count,
  }))
}
