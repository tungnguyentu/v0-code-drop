import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PricingFaq } from "@/components/pricing/pricing-faq"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-50">
              <Link href="/">Create Snippet</Link>
            </Button>
          </div>
        </header>

        <main>
          <section className="mx-auto max-w-5xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
              Choose the plan that's right for you and start sharing code with enhanced features.
            </p>

            <div className="grid gap-8 md:grid-cols-2 md:max-w-3xl mx-auto">
              <PricingCard
                title="Free"
                price="$0"
                description="Essential features for personal use"
                features={[
                  "Unlimited public snippets",
                  "Syntax highlighting",
                  "Password protection",
                  "Expiration settings",
                  "View limits",
                ]}
                buttonText="Get Started"
                buttonHref="/"
                popular={false}
              />

              <PricingCard
                title="Pro"
                price="$4.99"
                period="per month"
                description="Everything in Free, plus premium features"
                features={[
                  "Edit snippets after creation",
                  "Delete snippets",
                  "Private snippets",
                  "Remove branding",
                  "Priority support",
                ]}
                buttonText="Subscribe Now"
                buttonHref="/subscribe/pro"
                popular={true}
              />
            </div>
          </section>

          <PricingFaq />
        </main>

        <Footer />
      </div>
    </div>
  )
}
