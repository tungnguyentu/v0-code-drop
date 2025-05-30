"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Loader2, Clock, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeEditor } from "@/components/code-editor"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LANGUAGE_OPTIONS, THEME_OPTIONS, EXPIRATION_OPTIONS, VIEW_LIMIT_OPTIONS } from "@/lib/constants"
import { detectLanguage } from "@/lib/language-detection"
import { updateSnippet } from "@/app/actions"
import { getExpiryOption, getViewLimitOption } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface SnippetData {
  id: string
  title: string
  content: string
  language: string
  theme: string
  createdAt: string
  expiresAt: string | null
  viewLimit: string
  viewCount: number
  isProtected: boolean
}

interface EditSnippetProps {
  snippet: SnippetData
  ownerCode: string
}

export function EditSnippet({ snippet, ownerCode }: EditSnippetProps) {
  const router = useRouter()
  const [title, setTitle] = useState(snippet.title)
  const [content, setContent] = useState(snippet.content)
  const [language, setLanguage] = useState(snippet.language)
  const [theme, setTheme] = useState(snippet.theme)
  const [expiration, setExpiration] = useState(getExpiryOption(snippet.expiresAt))
  const [viewLimit, setViewLimit] = useState(getViewLimitOption(snippet.viewLimit))
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes to enable/disable save button
  const trackChanges = () => {
    const changed = title !== snippet.title || 
                   content !== snippet.content || 
                   language !== snippet.language || 
                   theme !== snippet.theme ||
                   expiration !== getExpiryOption(snippet.expiresAt) ||
                   viewLimit !== getViewLimitOption(snippet.viewLimit)
    setHasChanges(changed)
  }

  // Handle content change with language detection
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent)
      
      // Only attempt to detect language if we're still using the original language
      // or if the content is being pasted (significant change in length)
      const contentLengthChange = Math.abs(newContent.length - content.length)
      const isProbablyPaste = contentLengthChange > 10

      if (language === snippet.language || isProbablyPaste) {
        const detectedLang = detectLanguage(newContent)

        if (detectedLang !== "plaintext" && detectedLang !== language) {
          setLanguage(detectedLang)

          toast({
            title: "Language detected",
            description: `Detected ${LANGUAGE_OPTIONS.find((l) => l.value === detectedLang)?.label || detectedLang}`,
            duration: 3000,
          })
        }
      }
      
      trackChanges()
    },
    [content, language, snippet.language],
  )

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    trackChanges()
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    trackChanges()
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    trackChanges()
  }

  const handleExpirationChange = (newExpiration: string) => {
    setExpiration(newExpiration)
    trackChanges()
  }

  const handleViewLimitChange = (newViewLimit: string) => {
    setViewLimit(newViewLimit)
    trackChanges()
  }

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: "No changes",
        description: "No changes have been made to save.",
      })
      return
    }

    setIsSaving(true)

    try {
      const result = await updateSnippet(snippet.id, ownerCode, {
        title,
        content,
        language,
        theme,
        expiryOption: expiration,
        viewLimitOption: viewLimit,
      })

      if (result.success) {
        toast({
          title: "Snippet updated!",
          description: "Your changes have been saved successfully.",
        })
        // Navigate back to the snippet view
        router.push(`/${snippet.id}`)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save changes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
      return
    }
    router.push(`/${snippet.id}`)
  }

  // Get current status text for expiration
  const getCurrentExpiryStatus = () => {
    if (!snippet.expiresAt) return "Never expires"
    const expiryDate = new Date(snippet.expiresAt)
    const now = new Date()
    if (expiryDate < now) return "Already expired"
    return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
  }

  // Get current status text for view limit
  const getCurrentViewStatus = () => {
    if (snippet.viewLimit === "unlimited") {
      return `Current views: ${snippet.viewCount} / Unlimited`
    }
    return `Current views: ${snippet.viewCount} / ${snippet.viewLimit}`
  }

  // Check if view limit change is valid
  const isViewLimitChangeValid = () => {
    if (viewLimit === "unlimited") return true
    const newLimitNum = parseInt(viewLimit)
    return snippet.viewCount <= newLimitNum
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Edit Snippet
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Created on {new Date(snippet.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving || !isViewLimitChangeValid()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg shadow-emerald-100/20">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-gray-700">
                  Title (optional)
                </Label>
                <Input
                  id="title"
                  placeholder="Untitled Snippet"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="mt-1.5 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-gray-700">
                  Content
                </Label>
                <div className="mt-1.5 overflow-hidden rounded-lg border border-gray-200">
                  <CodeEditor value={content} onChange={handleContentChange} language={language} theme={theme} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="language" className="text-gray-700">
                    Syntax Highlighting
                  </Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="mt-1.5 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme" className="text-gray-700">
                    Editor Theme
                  </Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="mt-1.5 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_OPTIONS.map((themeOption) => (
                        <SelectItem key={themeOption.value} value={themeOption.value}>
                          {themeOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expiration and View Limit Settings */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Snippet Settings</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="expiration" className="text-gray-700">
                      Expiration
                    </Label>
                    <Select value={expiration} onValueChange={handleExpirationChange}>
                      <SelectTrigger className="mt-1.5 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPIRATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {getCurrentExpiryStatus()}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="viewLimit" className="text-gray-700">
                      View Limit
                    </Label>
                    <Select value={viewLimit} onValueChange={handleViewLimitChange}>
                      <SelectTrigger className="mt-1.5 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VIEW_LIMIT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      {getCurrentViewStatus()}
                    </div>
                  </div>
                </div>

                {!isViewLimitChangeValid() && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                      Cannot set view limit below current view count ({snippet.viewCount} views). 
                      Choose a higher limit or set to unlimited.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Display read-only snippet metadata */}
              <div className="pt-4 border-t border-gray-100">
                <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-3">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Protected:</span>{" "}
                    {snippet.isProtected ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-medium">Snippet ID:</span>{" "}
                    {snippet.id}
                  </div>
                </div>
              </div>

              {hasChanges && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm text-amber-700">
                    You have unsaved changes. Don't forget to save your work!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 