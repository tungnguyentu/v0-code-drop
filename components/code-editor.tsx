"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  className?: string
}

export function CodeEditor({ value, onChange, language, className }: CodeEditorProps) {
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

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Paste your code or text here..."
      className={cn(
        "min-h-[300px] font-mono text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className,
      )}
      spellCheck={false}
    />
  )
}
