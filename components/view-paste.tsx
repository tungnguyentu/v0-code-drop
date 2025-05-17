"use client"

import { useState } from "react"
import { Check, Copy, Clock, Eye, Palette } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  vs,
  vscDarkPlus,
  github,
  dracula,
  monokai,
  solarizedlight,
  solarizedDark,
  nord,
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { THEME_OPTIONS } from "@/lib/constants"
import { DeleteSnippet } from "@/components/delete-snippet"

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
  const [copied, setCopied] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(paste.theme || "vs")

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

  // Get the appropriate style based on the theme
  const getThemeStyle = () => {
    switch (currentTheme) {
      case "vs-dark":
        return vscDarkPlus
      case "github":
        return github
      case "dracula":
        return dracula
      case "monokai":
        return monokai
      case "solarized-light":
        return solarizedlight
      case "solarized-dark":
        return solarizedDark
      case "nord":
        return nord
      case "one-light":
        return oneLight
      case "one-dark":
        return oneDark
      default:
        return vs // Light theme (default)
    }
  }

  // Get the current theme label
  const getCurrentThemeLabel = () => {
    const theme = THEME_OPTIONS.find((t) => t.value === currentTheme)
    return theme ? theme.label : "Light (VS)"
  }

  return (
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
          <DeleteSnippet snippetId={paste.id} />

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
  )
}
