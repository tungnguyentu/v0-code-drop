"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, CreditCard, Code, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"

interface UserAccountNavProps {
  user: {
    email: string
    isPremium: boolean
  }
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const router = useRouter()
  const { refreshSession } = useCurrentUser()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const result = await signOut()
      if (result.success) {
        await refreshSession() // Update the auth context
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-gray-200 hover:bg-gray-50">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.email}</p>
            {user.isPremium ? (
              <p className="text-xs text-emerald-600">Premium User</p>
            ) : (
              <p className="text-xs text-gray-500">Free User</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/snippets" className="cursor-pointer flex w-full items-center">
            <Code className="mr-2 h-4 w-4" />
            <span>My Snippets</span>
          </Link>
        </DropdownMenuItem>
        {!user.isPremium && (
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="cursor-pointer flex w-full items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Upgrade to Premium</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onSelect={(e) => {
            e.preventDefault()
            handleSignOut()
          }}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
