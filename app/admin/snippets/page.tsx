"use client"

import Link from "next/link"
import useSWR from "swr"
import { useState } from "react"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, ExternalLink, Lock, Palette, RefreshCw } from "lucide-react"
import { DeleteSnippetButton } from "@/components/admin/delete-snippet-button"
import { Badge } from "@/components/ui/badge"
import { THEME_OPTIONS } from "@/lib/constants"
import { getSnippetsList } from "@/app/actions/snippets"
import { formatDistanceToNow } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Helper function to get theme label
const getThemeLabel = (themeValue: string) => {
  const theme = THEME_OPTIONS.find((t) => t.value === themeValue)
  return theme ? theme.label : "Light (VS)"
}

export default function AdminSnippetsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    data: snippets = [],
    error,
    mutate,
    isValidating,
  } = useSWR("snippets", getSnippetsList, {
    refreshInterval: autoRefresh ? 15000 : 0, // Refresh every 15 seconds if enabled
    revalidateOnFocus: false, // Don't revalidate on focus to reduce API calls
    dedupingInterval: 5000, // Deduplicate requests within 5 seconds
    errorRetryCount: 3, // Retry 3 times on error
  })

  if (error) {
    console.error("Error fetching snippets:", error)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
  }

  return (
    <DashboardLayout title="Manage Snippets">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Snippets</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <Label htmlFor="auto-refresh">Auto-refresh</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isValidating}
              className="border-gray-200 hover:bg-gray-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing || isValidating ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isValidating && !snippets.length && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {!isValidating && snippets.length === 0 && (
            <p className="text-center text-gray-500 py-8">No snippets found</p>
          )}

          {snippets.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Title</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Language</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Theme</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Created</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Expires</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Views</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {snippets.map((snippet) => (
                    <tr key={snippet.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{snippet.short_id}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {snippet.title || "Untitled"}
                          {snippet.is_protected && (
                            <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Protected
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{snippet.language}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Palette className="h-3.5 w-3.5 text-gray-400" />
                          {getThemeLabel(snippet.theme || "vs")}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {snippet.expires_at
                          ? formatDistanceToNow(new Date(snippet.expires_at), { addSuffix: true })
                          : "Never"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center">
                          <Eye className="mr-1 h-4 w-4 text-gray-400" />
                          {snippet.view_count} / {snippet.view_limit}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <Link href={`/${snippet.short_id}`} target="_blank">
                            <Button variant="outline" size="sm" className="h-8 border-gray-200 hover:bg-gray-100">
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          <DeleteSnippetButton id={snippet.short_id} onDelete={() => mutate()} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
