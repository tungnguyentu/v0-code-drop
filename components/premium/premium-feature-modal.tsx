"use client"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PremiumFeatureModalProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
}

export function PremiumFeatureModal({ isOpen, onClose, isAuthenticated }: PremiumFeatureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">Premium Feature</DialogTitle>
          <DialogDescription className="text-center">
            This feature is available exclusively to premium subscribers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-center text-sm text-gray-700">
            Upgrade to our premium plan to unlock advanced features including:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="mr-2 text-amber-500">✓</span> Edit snippets after creation
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-amber-500">✓</span> Delete snippets
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-amber-500">✓</span> Private snippets
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-amber-500">✓</span> Remove branding
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-amber-500">✓</span> Priority support
            </li>
          </ul>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
          {isAuthenticated ? (
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="mt-2 sm:mt-0">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <Button variant="outline" onClick={onClose} className="mt-2 sm:mt-0">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
