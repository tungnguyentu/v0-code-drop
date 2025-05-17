"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Sparkles, LogIn, Loader2 } from "lucide-react"
import { UserAccountNav } from "@/components/user/user-account-nav"
import { useCurrentUser } from "@/hooks/use-current-user"

export function Header() {
  const { user, isLoading } = useCurrentUser()

  return (
    <header className="mb-8 flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50" disabled>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading...</span>
          </Button>
        ) : user ? (
          <UserAccountNav user={user} />
        ) : (
          <>
            <Button asChild variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
              <Link href="/auth/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
              <Link href="/pricing" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Premium</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
