import { PasteForm } from "@/components/paste-form"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function Home() {
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
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg shadow-emerald-100/20">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create a new snippet
              </h2>
              <PasteForm />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
