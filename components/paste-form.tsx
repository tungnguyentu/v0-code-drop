"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Eye, EyeOff, Loader2, Lock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { createPaste } from "@/app/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeEditor } from "@/components/code-editor"
import { Switch } from "@/components/ui/switch"
import { LANGUAGE_OPTIONS, EXPIRATION_OPTIONS, VIEW_LIMIT_OPTIONS, THEME_OPTIONS } from "@/lib/constants"
import { detectLanguage } from "@/lib/language-detection"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PasteForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState("plaintext")
  const [expiration, setExpiration] = useState("1d")
  const [viewLimit, setViewLimit] = useState("unlimited")
  const [theme, setTheme] = useState("vs")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pasteUrl, setPasteUrl] = useState("")
  const [copied, setCopied] = useState(false)

  // Language detection state
  const [detectionResult, setDetectionResult] = useState<{
    language: string
    confidence: number
    confidenceLevel: "high" | "medium" | "low" | "minimum"
    secondaryLanguage: string | null
  } | null>(null)

  // Password protection
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Auto-detect language when content changes
  useEffect(() => {
    if (content.trim().length > 20) {
      const result = detectLanguage(content)
      setDetectionResult(result)

      // Only auto-set the language if we have high or medium confidence
      // or if the current language is plaintext (default)
      if (
        (result.confidenceLevel === "high" || result.confidenceLevel === "medium" || language === "plaintext") &&
        result.language !== "plaintext"
      ) {
        setLanguage(result.language)
      }
    } else {
      setDetectionResult(null)
    }
  }, [content, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const pasteId = await createPaste({
        title,
        content,
        language,
        expiration,
        viewLimit,
        password: isPasswordProtected ? password : undefined,
        theme,
      })

      // Generate a shareable URL
      const url = `${window.location.origin}/${pasteId}`
      setPasteUrl(url)
    } catch (error) {
      console.error("Error creating paste:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pasteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const createNewPaste = () => {
    setTitle("")
    setContent("")
    setLanguage("plaintext")
    setExpiration("1d")
    setViewLimit("unlimited")
    setTheme("vs")
    setIsPasswordProtected(false)
    setPassword("")
    setPasteUrl("")
    setDetectionResult(null)
  }

  // Handle content paste event for language detection
  const handleContentPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, pastedText: string) => {
    if (pastedText && pastedText.length > 20) {
      const result = detectLanguage(pastedText)
      setDetectionResult(result)

      // Only auto-set the language if we have high or medium confidence
      // or if the current language is plaintext (default)
      if (
        (result.confidenceLevel === "high" || result.confidenceLevel === "medium" || language === "plaintext") &&
        result.language !== "plaintext"
      ) {
        setLanguage(result.language)
      }
    }
  }

  // Get confidence indicator color
  const getConfidenceColor = (level: "high" | "medium" | "low" | "minimum") => {
    switch (level) {
      case "high":
        return "text-emerald-500"
      case "medium":
        return "text-blue-500"
      case "low":
        return "text-amber-500"
      case "minimum":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  // Get confidence icon
  const getConfidenceIcon = (level: "high" | "medium" | "low" | "minimum") => {
    switch (level) {
      case "high":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "medium":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "minimum":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div>
      {pasteUrl ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-medium">Snippet Created!</h3>
            <p className="text-gray-500">Your code snippet has been created successfully. Share the link below:</p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <Input
              value={pasteUrl}
              readOnly
              className="font-mono text-sm border-gray-200 bg-gray-50"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="flex-shrink-0 border-gray-200 hover:bg-gray-100"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {isPasswordProtected && (
            <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-700 flex items-center">
              <Lock className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">This snippet is password protected</p>
                <p className="text-sm">Anyone with the link will need the password to view it</p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={createNewPaste}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              Create Another Snippet
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-gray-700">
              Title (optional)
            </Label>
            <Input
              id="title"
              placeholder="Untitled Snippet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-gray-700">
              Content
            </Label>
            <div className="mt-1.5 overflow-hidden rounded-lg border border-gray-200">
              <CodeEditor
                value={content}
                onChange={setContent}
                language={language}
                theme={theme}
                onPaste={handleContentPaste}
              />
            </div>
            {detectionResult && content.length > 20 && (
              <div className="mt-2 flex items-center text-xs">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        {getConfidenceIcon(detectionResult.confidenceLevel)}
                        <span className={getConfidenceColor(detectionResult.confidenceLevel)}>
                          Language detected:{" "}
                          {LANGUAGE_OPTIONS.find((l) => l.value === detectionResult.language)?.label ||
                            detectionResult.language}
                          {detectionResult.secondaryLanguage && detectionResult.confidenceLevel !== "high" && (
                            <span>
                              {" "}
                              (may contain{" "}
                              {LANGUAGE_OPTIONS.find((l) => l.value === detectionResult.secondaryLanguage)?.label ||
                                detectionResult.secondaryLanguage}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Confidence: {Math.round(detectionResult.confidence * 100)}%</p>
                      {detectionResult.secondaryLanguage && (
                        <p>
                          Alternative:{" "}
                          {LANGUAGE_OPTIONS.find((l) => l.value === detectionResult.secondaryLanguage)?.label ||
                            detectionResult.secondaryLanguage}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="language" className="text-gray-700">
                Syntax Highlighting
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  id="language"
                  className="mt-1.5 border-gray-200 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                >
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
            </div>

            <div>
              <Label htmlFor="theme" className="text-gray-700">
                Theme
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger
                  id="theme"
                  className="mt-1.5 border-gray-200 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiration" className="text-gray-700">
                Expiration
              </Label>
              <Select value={expiration} onValueChange={setExpiration}>
                <SelectTrigger
                  id="expiration"
                  className="mt-1.5 border-gray-200 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="viewLimit" className="text-gray-700">
                View Limit
              </Label>
              <Select value={viewLimit} onValueChange={setViewLimit}>
                <SelectTrigger
                  id="viewLimit"
                  className="mt-1.5 border-gray-200 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <SelectValue placeholder="Select view limit" />
                </SelectTrigger>
                <SelectContent>
                  {VIEW_LIMIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <Label htmlFor="password-protection" className="text-gray-700 font-medium">
                  Password Protection
                </Label>
              </div>
              <Switch id="password-protection" checked={isPasswordProtected} onCheckedChange={setIsPasswordProtected} />
            </div>

            {isPasswordProtected && (
              <div className="mt-4">
                <Label htmlFor="password" className="text-gray-700">
                  Set Password
                </Label>
                <div className="mt-1.5 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a secure password"
                    className="border-gray-200 pr-10 focus:border-emerald-500 focus:ring-emerald-500"
                    required={isPasswordProtected}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Anyone with the link will need this password to view the snippet
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            disabled={!content || isSubmitting || (isPasswordProtected && !password)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Snippet"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
