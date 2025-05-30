"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Eye, EyeOff, Loader2, Lock, AlertTriangle } from "lucide-react"
import { createPaste } from "@/app/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeEditor } from "@/components/code-editor"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LANGUAGE_OPTIONS, EXPIRATION_OPTIONS, VIEW_LIMIT_OPTIONS, THEME_OPTIONS } from "@/lib/constants"
import { detectLanguage } from "@/lib/language-detection"
import { toast } from "@/components/ui/use-toast"

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

  // Owner code state
  const [ownerCode, setOwnerCode] = useState("")

  // Password protection
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Handle content change with language detection
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent)

      // Only attempt to detect language if we're still using the default language
      // or if the content is being pasted (significant change in length)
      const contentLengthChange = Math.abs(newContent.length - content.length)
      const isProbablyPaste = contentLengthChange > 10

      if (language === "plaintext" || isProbablyPaste) {
        const detectedLang = detectLanguage(newContent)

        if (detectedLang !== "plaintext") {
          setLanguage(detectedLang)

          // Show a toast notification about the detected language
          toast({
            title: "Language detected",
            description: `Detected ${LANGUAGE_OPTIONS.find((l) => l.value === detectedLang)?.label || detectedLang}`,
            duration: 3000,
          })
        }
      }
    },
    [content, language],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createPaste({
        title,
        content,
        language,
        expiration,
        viewLimit,
        password: isPasswordProtected ? password : undefined,
        theme,
      })

      // Generate a shareable URL
      const url = `${window.location.origin}/${result.shortId}`
      setPasteUrl(url)
      setOwnerCode(result.ownerCode)
    } catch (error) {
      console.error("Error creating paste:", error)
      toast({
        title: "Error",
        description: "Failed to create snippet. Please try again.",
        variant: "destructive",
      })
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
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyOwnerCode = async () => {
    try {
      await navigator.clipboard.writeText(ownerCode)
      toast({
        title: "Copied!",
        description: "Owner code copied to clipboard",
      })
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
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
    setOwnerCode("")
  }

  return (
    <div>
      {pasteUrl && ownerCode ? (
        <div className="space-y-6">
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
          </div>

          {/* Owner Code Display */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Save Your Owner Code
              </CardTitle>
              <CardDescription className="text-amber-700">
                You'll need this code to edit or delete your snippet. It will not be shown again!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <strong>Important:</strong> Save this code in a secure location. Without it, you won't be able to edit or delete your snippet.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-white">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">Owner Code</div>
                  <div className="font-mono text-lg text-gray-900 mt-1">{ownerCode}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyOwnerCode}
                  className="ml-3"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-gray-600">
                <p><strong>Owner Code:</strong> Allows you to edit and delete this snippet</p>
              </div>
            </CardContent>
          </Card>

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
              <CodeEditor value={content} onChange={handleContentChange} language={language} theme={theme} />
            </div>
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

          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
            <div className="mb-3 flex items-center space-x-2">
              <Switch
                id="password-protection"
                checked={isPasswordProtected}
                onCheckedChange={setIsPasswordProtected}
              />
              <Label htmlFor="password-protection" className="text-gray-700 cursor-pointer">
                Password Protection
              </Label>
            </div>

            {isPasswordProtected && (
              <div className="relative">
                <Input
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Snippet...
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
