"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PlanDetails {
  name: string
  price: string
  period: string
  features: string[]
}

interface SubscriptionFormProps {
  plan: string
  planDetails: PlanDetails
}

export function SubscriptionForm({ plan, planDetails }: SubscriptionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  // This would be connected to a real payment processor in production
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to success page
    router.push("/subscribe/success")
  }

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Enter your payment details to subscribe to the {planDetails.name} plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="mt-1 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="mt-2 flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-grow cursor-pointer">
                      Credit Card
                    </Label>
                    <div className="flex space-x-1">
                      <div className="h-6 w-10 rounded bg-blue-600"></div>
                      <div className="h-6 w-10 rounded bg-red-500"></div>
                      <div className="h-6 w-10 rounded bg-gray-800"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-grow cursor-pointer">
                      PayPal
                    </Label>
                    <div className="h-6 w-10 rounded bg-blue-700"></div>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "credit-card" && (
                <>
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="mt-1 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        required
                        className="mt-1 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        required
                        className="mt-1 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Name on Card</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      className="mt-1 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">{planDetails.name} Plan</span>
              <span>
                {planDetails.price}
                <span className="text-sm text-gray-500">{planDetails.period}</span>
              </span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="mb-2 font-medium">Included Features:</h4>
              <ul className="space-y-2">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-emerald-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-200 pt-4">
          <span className="font-medium">Total</span>
          <span className="font-bold">
            {planDetails.price}
            <span className="text-sm text-gray-500">{planDetails.period}</span>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
