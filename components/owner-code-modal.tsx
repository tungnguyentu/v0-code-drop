"use client"

import { useState } from "react"
import { Key, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OwnerCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (ownerCode: string) => Promise<void>
  title: string
  description: string
  confirmButtonText: string
  isDestructive?: boolean
}

export function OwnerCodeModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  isDestructive = false,
}: OwnerCodeModalProps) {
  const [ownerCode, setOwnerCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ownerCode.trim()) {
      setError("Please enter your owner code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onConfirm(ownerCode.trim())
      handleClose()
    } catch (error: any) {
      setError(error.message || "Invalid owner code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOwnerCode("")
    setError("")
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Key className="h-6 w-6 text-gray-600" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="owner-code">Owner Code</Label>
            <Input
              id="owner-code"
              placeholder="OWN-ABCDEFGHI"
              value={ownerCode}
              onChange={(e) => setOwnerCode(e.target.value)}
              className="mt-1 font-mono"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !ownerCode.trim()}
              className={`w-full sm:w-auto ${
                isDestructive
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                confirmButtonText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 