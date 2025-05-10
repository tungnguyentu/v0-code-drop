"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Loader2 } from "lucide-react"
import { submitFeedback } from "@/app/actions/feedback"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FEEDBACK_TYPES = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "praise", label: "Praise" },
  { value: "other", label: "Other" },
]

export function FeedbackDialog() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("suggestion")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const result = await submitFeedback({
        type,
        message,
        email: email || undefined,
      })

      setResult(result)

      if (result.success) {
        // Reset form on success
        setTimeout(() => {
          setType("suggestion")
          setMessage("")
          setEmail("")
          setOpen(false)
          setResult(null)
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>We value your feedback! Let us know how we can improve Codin.</DialogDescription>
        </DialogHeader>

        {result ? (
          <div
            className={`my-4 rounded-md p-4 text-sm ${
              result.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger
                  id="feedback-type"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                className="min-h-[100px] border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-email">Email (optional)</Label>
              <Input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500">Provide your email if you'd like us to follow up with you.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-200">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
