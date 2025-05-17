import { PasteForm } from "@/components/paste-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

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
