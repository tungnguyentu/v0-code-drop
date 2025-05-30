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
  params: Promise<{
    id: string
  }>
}

export default async function PastePage({ params }: PastePageProps) {
  const { id } = await params

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
        </header>

        <main>
          <section className="mx-auto max-w-4xl">
            {paste.isProtected && !('content' in paste) ? (
              <PasswordVerification pasteId={id} title={paste.title} />
            ) : (
              <ViewPaste paste={paste as any} />
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
