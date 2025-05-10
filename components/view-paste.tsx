"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

interface Paste {
  id: string
  title: string
  content: string
  language: string
  createdAt: string
  expiresAt: string | null
  viewLimit: string
  viewCount: number
}

interface ViewPasteProps {
  paste: Paste
}

export function ViewPaste({ paste }: ViewPasteProps) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const createdDate = new Date(paste.createdAt)
  const expiresDate = paste.expiresAt ? new Date(paste.expiresAt) : null

  return (
    <Card className="overflow-hidden bg-white shadow-sm dark:bg-card">
      <CardHeader className="bg-slate-50 dark:bg-muted/50">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{paste.title || "Untitled Paste"}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white dark:bg-transparent">
              {paste.language}
            </Badge>
            {paste.viewLimit !== "unlimited" && (
              <Badge variant="outline" className="bg-white dark:bg-transparent">
                {paste.viewCount} / {paste.viewLimit} views
              </Badge>
            )}
            {expiresDate && (
              <Badge variant="outline" className="bg-white dark:bg-transparent">
                Expires: {formatDistanceToNow(expiresDate, { addSuffix: true })}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(createdDate, { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 z-10 text-sky-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-muted"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <div className="max-h-[600px] overflow-auto">
            <SyntaxHighlighter
              language={paste.language === "plaintext" ? "text" : paste.language}
              style={theme === "dark" ? vscDarkPlus : vs}
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
      </CardContent>
    </Card>
  )
}
