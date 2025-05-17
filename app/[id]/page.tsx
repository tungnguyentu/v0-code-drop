import { notFound } from "next/navigation"
import { ViewPaste } from "@/components/view-paste"
import { PasswordVerification } from "@/components/password-verification"
import { getPasteById } from "@/app/actions"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

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
