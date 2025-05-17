"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: string
  className?: string
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>, content: string) => void
}

export function CodeEditor({ value, onChange, language, theme = "vs", className, onPaste }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle tab key to insert spaces instead of changing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      onChange(newValue)

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  // Handle paste event with enhanced information
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text")
    if (onPaste && pastedText) {
      onPaste(e, pastedText)
    }
  }

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  // Apply theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case "vs-dark":
        return "bg-gray-900 text-gray-100"
      case "dracula":
        return "bg-[#282a36] text-[#f8f8f2]"
      case "monokai":
        return "bg-[#272822] text-[#f8f8f2]"
      case "solarized-dark":
        return "bg-[#002b36] text-[#839496]"
      case "solarized-light":
        return "bg-[#fdf6e3] text-[#657b83]"
      case "nord":
        return "bg-[#2e3440] text-[#d8dee9]"
      case "one-dark":
        return "bg-[#282c34] text-[#abb2bf]"
      case "one-light":
        return "bg-[#fafafa] text-[#383a42]"
      case "github":
        return "bg-white text-[#24292e]"
      default:
        return "bg-white text-gray-900" // vs (light) theme
    }
  }

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder="Paste your code or text here..."
      className={cn(
        "min-h-[300px] font-mono text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        getThemeStyles(),
        className,
      )}
      spellCheck={false}
    />
  )
}
