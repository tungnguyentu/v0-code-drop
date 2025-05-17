import { notFound } from "next/navigation"
import Link from "next/link"
import { ViewPaste } from "@/components/view-paste"
import { PasswordVerification } from "@/components/password-verification"
import { getPasteById } from "@/app/actions"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface PastePageProps {
  params: {
    id: string
  }
}

export default async function PastePage({ params }: PastePageProps) {
  const { id } = params

  // Skip fetching for known routes that aren't pastes
  if (id === "admin") {
    notFound()
  }

  const paste = await getPasteById(id)

  if (!paste) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Logo />
          <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-50">
            <Link href="/pricing" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Premium</span>
            </Link>
          </Button>
        </header>

        <main>
          <section className="mx-auto max-w-4xl">
            {paste.isProtected && !paste.content ? (
              <PasswordVerification pasteId={id} title={paste.title} />
            ) : (
              <ViewPaste paste={paste} />
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
