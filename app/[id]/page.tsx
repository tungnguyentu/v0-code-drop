import { notFound } from "next/navigation"
import { ViewPaste } from "@/components/view-paste"
import { PasswordVerification } from "@/components/password-verification"
import { getPasteById } from "@/app/actions"
import { getCurrentUser } from "@/app/actions/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface PastePageProps {
  params: {
    id: string
  }
}

export default async function PastePage({ params }: PastePageProps) {
  const { id } = await params

  // Skip fetching for known routes that aren't pastes
  if (id === "admin") {
    notFound()
  }

  const paste = await getPasteById(id)
  const user = await getCurrentUser()

  if (!paste) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main>
          <section className="mx-auto max-w-4xl">
            {paste.isProtected && !paste.content ? (
              <PasswordVerification pasteId={id} title={paste.title} />
            ) : (
              <ViewPaste paste={paste} user={user} />
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
