"use client"

import { useState } from "react"
import { Code, Loader2, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCode, isFormattingSupported } from "@/lib/code-formatter"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FormatCodeButtonProps {
  code: string
  language: string
  onFormatted: (formattedCode: string) => void
  className?: string
}

export function FormatCodeButton({ code, language, onFormatted, className }: FormatCodeButtonProps) {
  const [isFormatting, setIsFormatting] = useState(false)
  const [isFormatted, setIsFormatted] = useState(false)

  const isSupported = isFormattingSupported(language)

  const handleFormat = async () => {
    if (!isSupported) {
      toast({
        title: "Formatting not supported",
        description: `Automatic formatting is not supported for ${language}`,
        variant: "destructive",
      })
      return
    }

    if (!code.trim()) {
      toast({
        title: "Nothing to format",
        description: "Please enter some code first",
      })
      return
    }

    setIsFormatting(true)
    setIsFormatted(false)

    try {
      const { formatted, error } = await formatCode(code, language)

      if (error) {
        toast({
          title: "Formatting error",
          description: error,
          variant: "destructive",
        })
        return
      }

      onFormatted(formatted)
      setIsFormatted(true)

      toast({
        title: "Code formatted",
        description: "Your code has been formatted successfully",
      })

      // Reset the formatted state after 2 seconds
      setTimeout(() => {
        setIsFormatted(false)
      }, 2000)
    } catch (error) {
      console.error("Error formatting code:", error)
      toast({
        title: "Formatting failed",
        description: "An unexpected error occurred while formatting your code",
        variant: "destructive",
      })
    } finally {
      setIsFormatting(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 text-gray-700 hover:text-emerald-700 ${className}`}
            onClick={handleFormat}
            disabled={isFormatting || !isSupported}
          >
            {isFormatting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFormatted ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : !isSupported ? (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            ) : (
              <Code className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Format</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {!isSupported ? `Formatting not supported for ${language}` : "Format code with Prettier"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
