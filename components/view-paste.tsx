"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Clock, Eye, Palette, Edit, Trash2, Save, X, AlertTriangle } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { THEME_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants"
import { editPaste, deletePaste } from "@/app/actions/premium"
import { CodeEditor } from "@/components/code-editor"
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
import { PremiumFeatureModal } from "@/components/premium/premium-feature-modal"

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
  userId?: string
}

interface ViewPasteProps {
  paste: Paste
  user: any | null
}

export function ViewPaste({ paste, user }: ViewPasteProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(paste.theme || "vs")
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [editedTitle, setEditedTitle] = useState(paste.title)
  const [editedContent, setEditedContent] = useState(paste.content)
  const [editedLanguage, setEditedLanguage] = useState(paste.language)
  const [error, setError] = useState("")

  const isAuthenticated = !!user
  const isPremium = user?.isPremium || false
  const isOwner = user?.id === paste.userId

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleEdit = () => {
    if (!isAuthenticated) {
      setShowPremiumModal(true)
      return
    }

    if (!isPremium) {
      setShowPremiumModal(true)
      return
    }

    setIsEditing(true)
  }

  const handleDelete = () => {
    if (!isAuthenticated) {
      setShowPremiumModal(true)
      return
    }

    // All users can delete their own snippets
    if (!isOwner) {
      setError("You can only delete snippets that you own")
      return
    }

    // Continue with delete confirmation via AlertDialog
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")

    try {
      const result = await editPaste({
        id: paste.id,
        title: editedTitle,
        content: editedContent,
        language: editedLanguage,
        theme: currentTheme,
      })

      if (result.success) {
        setIsEditing(false)
        // Refresh the page to show updated content
        router.refresh()
      } else {
        setError(result.message || "Failed to save changes")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const result = await deletePaste(paste.id)

      if (result.success) {
        // Redirect to home page
        router.push("/")
      } else {
        setError(result.message || "Failed to delete snippet")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
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
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Untitled Snippet"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              ) : (
                <>
                  <h1 className="text-xl font-semibold text-gray-900">{paste.title || "Untitled Snippet"}</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Created {formatDistanceToNow(createdDate, { addSuffix: true })}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <Select value={editedLanguage} onValueChange={setEditedLanguage}>
                  <SelectTrigger className="w-[180px] border-gray-200 bg-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-700 hover:text-emerald-700"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-gray-700 hover:text-red-700"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
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
                          onClick={handleConfirmDelete}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-emerald-700"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-700"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
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
                <DropdownMenuContent align="end">
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

          {error && (
            <div className="p-2 bg-red-50 text-red-700 text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div className="max-h-[600px] overflow-auto">
            {isEditing ? (
              <CodeEditor
                value={editedContent}
                onChange={setEditedContent}
                language={editedLanguage}
                theme={currentTheme}
              />
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        isAuthenticated={isAuthenticated}
      />
    </>
  )
}
