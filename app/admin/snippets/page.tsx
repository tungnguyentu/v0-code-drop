import Link from "next/link"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { createServerClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, ExternalLink, Lock } from "lucide-react"
import { DeleteSnippetButton } from "@/components/admin/delete-snippet-button"
import { Badge } from "@/components/ui/badge"

async function getSnippets() {
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

  return snippets || []
}

export default async function AdminSnippetsPage() {
  const snippets = await getSnippets()

  return (
    <DashboardLayout title="Manage Snippets">
      <Card>
        <CardHeader>
          <CardTitle>All Snippets</CardTitle>
        </CardHeader>
        <CardContent>
          {snippets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Title</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Language</th>
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
                          <DeleteSnippetButton id={snippet.short_id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No snippets found</p>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
