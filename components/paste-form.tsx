"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Loader2 } from "lucide-react"
import { createPaste } from "@/app/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeEditor } from "@/components/code-editor"

const LANGUAGE_OPTIONS = [
  { value: "plaintext", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
]

const EXPIRATION_OPTIONS = [
  { value: "5m", label: "5 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "never", label: "Never" },
]

const VIEW_LIMIT_OPTIONS = [
  { value: "1", label: "1 view" },
  { value: "5", label: "5 views" },
  { value: "10", label: "10 views" },
  { value: "unlimited", label: "Unlimited" },
]

export function PasteForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState("plaintext")
  const [expiration, setExpiration] = useState("1d")
  const [viewLimit, setViewLimit] = useState("unlimited")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pasteUrl, setPasteUrl] = useState("")
  const [copied, setCopied] = useState(false)

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
    setPasteUrl("")
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
              <CodeEditor value={content} onChange={setContent} language={language} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            disabled={!content || isSubmitting}
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
