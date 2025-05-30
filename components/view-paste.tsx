"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Clock, Eye, Palette, Edit3, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  prism,
  vscDarkPlus,
  duotoneDark,
  duotoneLight,
  okaidia,
  solarizedlight,
  tomorrow,
  twilight,
} from "react-syntax-highlighter/dist/cjs/styles/prism"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { THEME_OPTIONS } from "@/lib/constants"
import { OwnerCodeModal } from "@/components/owner-code-modal"
import { deleteSnippet } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Paste {
  id: string
  title: string
  content: string
  language: string
  createdAt: string
  expiresAt: string | null
  viewLimit: string
  viewCount: number
  theme: string
}

interface ViewPasteProps {
  paste: Paste
}

export function ViewPaste({ paste }: ViewPasteProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(paste.theme || "vs")
  const [showOwnerModal, setShowOwnerModal] = useState(false)
  const [modalAction, setModalAction] = useState<"edit" | "delete">("edit")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [verifiedOwnerCode, setVerifiedOwnerCode] = useState("")

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleEditClick = () => {
    setModalAction("edit")
    setShowOwnerModal(true)
  }

  const handleDeleteClick = () => {
    setModalAction("delete")
    setShowOwnerModal(true)
  }

  const handleOwnerCodeConfirm = async (ownerCode: string) => {
    if (modalAction === "edit") {
      // Navigate to edit page with owner code
      router.push(`/${paste.id}/edit?code=${encodeURIComponent(ownerCode)}`)
    } else if (modalAction === "delete") {
      // Store the verified code and show delete confirmation
      setVerifiedOwnerCode(ownerCode)
      setShowDeleteConfirm(true)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteSnippet(paste.id, verifiedOwnerCode)
      
      if (result.success) {
        toast({
          title: "Snippet deleted",
          description: "Your snippet has been permanently deleted.",
        })
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete snippet",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the snippet.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(false)
      setVerifiedOwnerCode("")
    }
  }

  const createdDate = new Date(paste.createdAt)
  const expiresDate = paste.expiresAt ? new Date(paste.expiresAt) : null

  // Get the appropriate style based on the theme
  const getThemeStyle = () => {
    switch (currentTheme) {
      case "vs-dark":
        return vscDarkPlus
      case "github":
        return prism // Using prism as a replacement for github
      case "dracula":
        return duotoneDark
      case "monokai":
        return okaidia
      case "solarized-light":
        return solarizedlight
      case "solarized-dark":
        return duotoneDark
      case "nord":
        return tomorrow
      case "one-light":
        return duotoneLight
      case "one-dark":
        return twilight
      default:
        return prism // Light theme (default)
    }
  }

  // Get the current theme label
  const getCurrentThemeLabel = () => {
    const theme = THEME_OPTIONS.find((t) => t.value === currentTheme)
    return theme ? theme.label : "Light (VS)"
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg shadow-emerald-100/20">
        <div className="border-b border-gray-100 bg-gray-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{paste.title || "Untitled Snippet"}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Created {formatDistanceToNow(createdDate, { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{paste.language}</Badge>
              {paste.viewLimit !== "unlimited" && (
                <Badge className="flex items-center gap-1 bg-teal-100 text-teal-700 hover:bg-teal-200">
                  <Eye className="h-3 w-3" />
                  {paste.viewCount} / {paste.viewLimit}
                </Badge>
              )}
              {expiresDate && (
                <Badge className="flex items-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(expiresDate, { addSuffix: true })}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-700 hover:text-emerald-700"
                onClick={handleEditClick}
              >
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-700 hover:text-red-700"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Theme:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-700 hover:text-emerald-700"
                  >
                    <Palette className="h-4 w-4" />
                    <span>{getCurrentThemeLabel()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {THEME_OPTIONS.map((theme) => (
                    <DropdownMenuItem
                      key={theme.value}
                      onClick={() => setCurrentTheme(theme.value)}
                      className={currentTheme === theme.value ? "bg-gray-100" : ""}
                    >
                      {theme.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-700 hover:text-emerald-700"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="max-h-[600px] overflow-auto">
            <SyntaxHighlighter
              language={paste.language === "plaintext" ? "text" : paste.language}
              style={getThemeStyle()}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "0.9rem",
              }}
            >
              {paste.content}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Owner Code Modal */}
      <OwnerCodeModal
        isOpen={showOwnerModal}
        onClose={() => setShowOwnerModal(false)}
        onConfirm={handleOwnerCodeConfirm}
        title="Enter Owner Code"
        description={
          modalAction === "edit"
            ? "Enter your owner code to edit this snippet."
            : "Enter your owner code to delete this snippet."
        }
        confirmButtonText={modalAction === "edit" ? "Edit Snippet" : "Continue"}
        isDestructive={modalAction === "delete"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this snippet. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Snippet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
