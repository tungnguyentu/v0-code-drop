import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/app/actions/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, Eye } from "lucide-react"

export default async function MySnippetsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = createServerClient()
  const { data: snippets } = await supabase
    .from("pastes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main>
          <section className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">My Snippets</h1>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <Link href="/">Create New Snippet</Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Code Snippets</CardTitle>
              </CardHeader>
              <CardContent>
                {snippets && snippets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
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
                            <td className="py-3 px-4 text-sm font-medium">
                              {snippet.title || `Untitled (${snippet.short_id})`}
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
                              <Link href={`/${snippet.short_id}`}>
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
                  <div className="py-8 text-center">
                    <p className="text-gray-500">You haven't created any snippets yet.</p>
                    <Button
                      asChild
                      className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      <Link href="/">Create Your First Snippet</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
