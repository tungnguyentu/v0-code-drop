import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Sparkles, LogIn } from "lucide-react"
import { UserAccountNav } from "@/components/user/user-account-nav"
import { getCurrentUser } from "@/app/actions/auth"

export async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="mb-8 flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-4">
        {user ? (
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
