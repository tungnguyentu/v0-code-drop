import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Paste Not Found</h2>
        <p className="text-slate-600 dark:text-muted-foreground">
          The paste you're looking for doesn't exist or has expired.
        </p>
        <Button asChild className="bg-sky-500 hover:bg-sky-600 text-white">
          <Link href="/">Create a New Paste</Link>
        </Button>
      </div>
    </div>
  )
}
