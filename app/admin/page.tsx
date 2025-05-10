import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, FileCode, Eye } from "lucide-react"

async function getStats() {
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

  return {
    totalSnippets: totalSnippets || 0,
    activeSnippets: activeSnippets || 0,
    recentSnippets: recentSnippets || 0,
    mostViewed: mostViewed || [],
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <FileCode className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSnippets}</div>
            <p className="text-xs text-gray-500">All time snippets created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Snippets</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSnippets}</div>
            <p className="text-xs text-gray-500">Non-expired snippets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Snippets</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSnippets}</div>
            <p className="text-xs text-gray-500">Created in the last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Snippets</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.mostViewed.length > 0 ? (
              <div className="space-y-4">
                {stats.mostViewed.map((snippet) => (
                  <div key={snippet.short_id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileCode className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="font-medium">{snippet.title || `Untitled (${snippet.short_id})`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="mr-1 h-4 w-4" />
                      {snippet.view_count} views
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No snippets found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
