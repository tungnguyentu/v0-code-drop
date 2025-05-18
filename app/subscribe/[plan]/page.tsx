import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"
import { SubscriptionForm } from "@/components/subscription/subscription-form"

interface SubscribePageProps {
  params: Promise<{
    plan: string
  }>
}

export default async function SubscribePage({ params }: SubscribePageProps) {
  const { plan } = await params

  // Validate plan
  if (plan !== "pro") {
    notFound()
  }

  const planDetails = {
    pro: {
      name: "Pro",
      price: "$5",
      period: "per month",
      features: [
        "Edit snippets after creation",
        "Delete snippets",
        "Private snippets",
        "Remove branding",
        "Priority support",
      ],
    },
  }

  const details = planDetails[plan as keyof typeof planDetails]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-50">
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
          </div>
        </header>

        <main>
          <section className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Subscribe to {details.name}</h1>
              <p className="text-gray-600">Upgrade from Basic to unlock premium features and enhance your code sharing experience.</p>
            </div>

            <SubscriptionForm plan={plan} planDetails={details} />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
