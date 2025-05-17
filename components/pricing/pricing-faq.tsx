import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFaq() {
  return (
    <section className="mx-auto max-w-3xl py-16">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">What's included in the free plan?</AccordionTrigger>
          <AccordionContent>
            The free plan includes unlimited public snippets, syntax highlighting for over 40 programming languages,
            password protection, expiration settings, and view limits. It's perfect for personal use and occasional code
            sharing.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">Can I upgrade or downgrade my plan at any time?</AccordionTrigger>
          <AccordionContent>
            Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged the prorated
            amount for the remainder of your billing cycle. When you downgrade, the changes will take effect at the end
            of your current billing cycle.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">How does snippet editing work?</AccordionTrigger>
          <AccordionContent>
            With a premium plan, you can edit your snippets after creation. This allows you to update code, fix errors,
            or add new information without creating a new snippet. Your snippet's URL remains the same, so anyone with
            the link will always see the most up-to-date version.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also
            support payment via PayPal. All payments are processed securely through our payment provider.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left">Is there a refund policy?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer a 14-day money-back guarantee. If you're not satisfied with your premium plan within the first
            14 days, contact our support team for a full refund, no questions asked.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
