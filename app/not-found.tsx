import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white to-emerald-50">
      <div className="container flex max-w-md flex-col items-center justify-center gap-8 text-center">
        <Logo />

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Snippet Not Found</h2>
          <p className="text-gray-600">The code snippet you're looking for doesn't exist or has expired.</p>
        </div>

        <Button
          asChild
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
        >
          <Link href="/">Create a New Snippet</Link>
        </Button>
      </div>
    </div>
  )
}
