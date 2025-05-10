import { notFound } from "next/navigation"
import { ViewPaste } from "@/components/view-paste"
import { ModeToggle } from "@/components/mode-toggle"
import { getPasteById } from "@/app/actions"

interface PastePageProps {
  params: {
    id: string
  }
}

export default async function PastePage({ params }: PastePageProps) {
  const { id } = params

  // In a real app, this would fetch the paste from a database
  const paste = await getPasteById(id)

  if (!paste) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-background dark:to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-sky-500"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="m19 19-7-7 7-7" />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight">CodeDrop</h1>
          </div>
          <ModeToggle />
        </header>

        <main>
          <section className="mx-auto max-w-4xl">
            <ViewPaste paste={paste} />
          </section>
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeDrop. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
