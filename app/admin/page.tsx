"use client"

import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, FileCode, Eye } from "lucide-react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

async function getStats() {
  const response = await fetch("/api/admin/stats")
  if (!response.ok) {
    throw new Error("Failed to fetch stats")
  }
  return response.json()
}

export default function AdminDashboardPage() {
  const {
    data: stats,
    error,
    isLoading,
    mutate,
  } = useSWR("adminStats", getStats, {
    refreshInterval: 10000, // Refresh every 10 seconds
    revalidateOnFocus: true,
  })

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="text-red-500">Error loading dashboard data</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => mutate()} className="border-gray-200 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <FileCode className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSnippets || 0}</div>
            <p className="text-xs text-gray-500">All time snippets created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Snippets</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSnippets || 0}</div>
            <p className="text-xs text-gray-500">Non-expired snippets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Snippets</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentSnippets || 0}</div>
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
            {stats?.mostViewed?.length > 0 ? (
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
