import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Logo />
        </header>

        <main>
          <section className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">Subscription Successful!</h1>
            <p className="mb-8 text-lg text-gray-600">
              Thank you for subscribing to our premium plan. You now have access to all premium features.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <Link href="/">Create New Snippet</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Link href="/account">Manage Account</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
