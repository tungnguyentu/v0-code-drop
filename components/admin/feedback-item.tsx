"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Mail, Trash2, Clock } from "lucide-react"
import { updateFeedbackStatus, deleteFeedback } from "@/app/actions/feedback"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FeedbackItemProps {
  feedback: {
    id: string
    type: string
    message: string
    email: string | null
    created_at: string
    status: string
    is_read: boolean
  }
}

export function FeedbackItem({ feedback }: FeedbackItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true)
    try {
      await updateFeedbackStatus(feedback.id, status)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteFeedback(feedback.id)
    } catch (error) {
      console.error("Error deleting feedback:", error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusBadge = () => {
    switch (feedback.status) {
      case "new":
        return <Badge className="bg-emerald-100 text-emerald-700">New</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-700">Completed</Badge>
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-700">Dismissed</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = () => {
    switch (feedback.type) {
      case "bug":
        return <Badge className="bg-red-100 text-red-700">Bug</Badge>
      case "feature":
        return <Badge className="bg-blue-100 text-blue-700">Feature</Badge>
      case "suggestion":
        return <Badge className="bg-amber-100 text-amber-700">Suggestion</Badge>
      case "praise":
        return <Badge className="bg-emerald-100 text-emerald-700">Praise</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Other</Badge>
    }
  }

  return (
    <div
      className={`rounded-lg border p-4 ${!feedback.is_read ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100"}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            {getStatusBadge()}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {feedback.email && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-gray-200 hover:bg-gray-100"
                onClick={() => window.open(`mailto:${feedback.email}`)}
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="sr-only">Email</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-gray-200 hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">Status</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("new")}>Mark as New</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>Mark as Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("dismissed")}>Dismiss</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this feedback. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete()
                    }}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-2">
          <p className="whitespace-pre-wrap text-gray-800">{feedback.message}</p>
        </div>

        {feedback.email && <div className="mt-1 text-xs text-gray-500">From: {feedback.email}</div>}
      </div>
    </div>
  )
}
