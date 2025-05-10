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
import { Card } from "@/components/ui/card"
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
      // In a real app, this would call an API to create the paste
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
        <Card className="bg-white p-6 shadow-sm dark:bg-card">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-lg font-medium">Paste Created!</h3>
            <p className="text-muted-foreground">Your paste has been created successfully. Share the link below:</p>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <Input value={pasteUrl} readOnly className="font-mono text-sm" onClick={(e) => e.currentTarget.select()} />
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="flex-shrink-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button onClick={createNewPaste} className="bg-sky-500 hover:bg-sky-600 text-white">
              Create Another Paste
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Untitled Paste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="content">Content</Label>
            <CodeEditor value={content} onChange={setContent} language={language} />
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="language">Syntax Highlighting</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="mt-1">
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
              <Label htmlFor="expiration">Expiration</Label>
              <Select value={expiration} onValueChange={setExpiration}>
                <SelectTrigger id="expiration" className="mt-1">
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
              <Label htmlFor="viewLimit">View Limit</Label>
              <Select value={viewLimit} onValueChange={setViewLimit}>
                <SelectTrigger id="viewLimit" className="mt-1">
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
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            disabled={!content || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Paste"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
