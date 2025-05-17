import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PricingCardProps {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonHref: string
  popular?: boolean
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonHref,
  popular = false,
}: PricingCardProps) {
  return (
    <Card
      className={`flex flex-col border ${
        popular ? "border-emerald-200 shadow-lg shadow-emerald-100/50 relative" : "border-gray-200 shadow-md"
      }`}
    >
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          Most Popular
        </Badge>
      )}
      <CardHeader className="pb-8 pt-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-bold tracking-tight text-gray-900">{price}</span>
          {period && <span className="ml-1 text-sm text-gray-500">{period}</span>}
        </div>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pb-6">
        <Button
          asChild
          className={`w-full ${
            popular
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Link href={buttonHref}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
