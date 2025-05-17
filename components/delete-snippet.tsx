"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { deletePasteWithKey } from "@/app/actions"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeleteSnippetProps {
  snippetId: string
}

export function DeleteSnippet({ snippetId }: DeleteSnippetProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deletionKey, setDeletionKey] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleDelete = async () => {
    if (!deletionKey.trim()) {
      setError("Please enter a deletion key")
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const result = await deletePasteWithKey(snippetId, deletionKey)

      if (result.success) {
        setSuccess(true)
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError(result.message || "Failed to delete snippet")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error deleting snippet:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <Trash2 className="h-4 w-4" />
          Delete Snippet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Snippet</DialogTitle>
          <DialogDescription>
            Enter the deletion key that was provided when you created this snippet. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-4">
            <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
              <AlertDescription className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Snippet deleted successfully! Redirecting...
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            {error && (
              <Alert className="bg-red-50 text-red-800 border-red-200">
                <AlertDescription className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="deletion-key">Deletion Key</Label>
                <Input
                  id="deletion-key"
                  value={deletionKey}
                  onChange={(e) => setDeletionKey(e.target.value)}
                  placeholder="Enter your deletion key"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-200">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting || !deletionKey.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Snippet"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
