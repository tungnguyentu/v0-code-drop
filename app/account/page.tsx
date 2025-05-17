"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CreditCard, User, Shield, Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useCurrentUser()

  // Redirect if not authenticated after loading completes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not loading, the useEffect will handle redirect
  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main>
          <section className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-3xl font-bold">Account Settings</h1>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-500" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="text-gray-900">{user.isPremium ? "Premium" : "Free"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-gray-900">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Subscription
                  </CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Plan</p>
                      <p className="text-gray-900">{user.isPremium ? "Premium" : "Free"}</p>
                    </div>
                    {user.isPremium && user.profile?.subscription_end_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Renewal Date</p>
                        <p className="text-gray-900">
                          {new Date(user.profile.subscription_end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                    <div className="pt-2">
                      {user.isPremium ? (
                        <Button asChild variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                          <Link href="/account/billing">Manage Subscription</Link>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                        >
                          <Link href="/pricing">Upgrade to Premium</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-50">
                      <Link href="/auth/reset-password">Change Password</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
