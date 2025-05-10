import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Eye, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MostViewedSnippetsProps {
  data: Array<{
    short_id: string
    title: string | null
    language: string
    view_count: number
    created_at: string
  }>
}

export function MostViewedSnippets({ data }: MostViewedSnippetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Viewed Snippets</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Language</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Created</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Views</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((snippet) => (
                  <tr key={snippet.short_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">
                      {snippet.title || `Untitled (${snippet.short_id})`}
                    </td>
                    <td className="py-3 px-4 text-sm">{snippet.language}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        <Eye className="mr-1 h-4 w-4 text-gray-400" />
                        {snippet.view_count}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Link href={`/${snippet.short_id}`} target="_blank">
                        <Button variant="outline" size="sm" className="h-8 border-gray-200 hover:bg-gray-100">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No snippets found</p>
        )}
      </CardContent>
    </Card>
  )
}
