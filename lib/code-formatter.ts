import prettier from "prettier/standalone"
import parserBabel from "prettier/parser-babel"
import parserHtml from "prettier/parser-html"
import parserCss from "prettier/parser-postcss"
import parserMarkdown from "prettier/parser-markdown"
import parserTypescript from "prettier/parser-typescript"
import parserYaml from "prettier/parser-yaml"

// Map of language identifiers to Prettier parser names
const LANGUAGE_TO_PARSER: Record<string, string> = {
  javascript: "babel",
  typescript: "typescript",
  jsx: "babel",
  tsx: "typescript",
  html: "html",
  css: "css",
  json: "json",
  markdown: "markdown",
  yaml: "yaml",
  yml: "yaml",
  graphql: "graphql",
}

// Map of file extensions to Prettier parser names
const EXTENSION_TO_PARSER: Record<string, string> = {
  js: "babel",
  jsx: "babel",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  htm: "html",
  css: "css",
  json: "json",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
  gql: "graphql",
}

// Get the appropriate parser for a language
function getParserForLanguage(language: string): string | undefined {
  return LANGUAGE_TO_PARSER[language]
}

// Get the appropriate parser for a file extension
function getParserForExtension(filename: string): string | undefined {
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension ? EXTENSION_TO_PARSER[extension] : undefined
}

// Default formatting options
const DEFAULT_OPTIONS = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
}

/**
 * Format code using Prettier
 * @param code The code to format
 * @param language The language of the code
 * @param options Optional formatting options
 * @returns Formatted code or original code if formatting fails
 */
export async function formatCode(
  code: string,
  language: string,
  options: Record<string, any> = {},
): Promise<{ formatted: string; error?: string }> {
  try {
    // Skip formatting for plaintext
    if (language === "plaintext") {
      return { formatted: code }
    }

    // Determine the parser to use
    let parser = getParserForLanguage(language)

    // If no parser is found for the language, try to infer from common mappings
    if (!parser) {
      switch (language) {
        case "python":
        case "ruby":
        case "php":
        case "go":
        case "rust":
        case "swift":
        case "kotlin":
        case "java":
        case "csharp":
        case "cpp":
        case "bash":
          // For languages without direct Prettier support, we'll return the original code
          return { formatted: code }
        default:
          // For unknown languages, default to babel for JS-like syntax
          parser = "babel"
      }
    }

    // Configure the plugins based on the parser
    const plugins = []
    if (["babel", "json", "flow"].includes(parser)) {
      plugins.push(parserBabel)
    }
    if (["typescript"].includes(parser)) {
      plugins.push(parserTypescript)
    }
    if (["html"].includes(parser)) {
      plugins.push(parserHtml)
    }
    if (["css"].includes(parser)) {
      plugins.push(parserCss)
    }
    if (["markdown"].includes(parser)) {
      plugins.push(parserMarkdown)
    }
    if (["yaml"].includes(parser)) {
      plugins.push(parserYaml)
    }

    // Format the code
    const formatted = await prettier.format(code, {
      ...DEFAULT_OPTIONS,
      ...options,
      parser,
      plugins,
    })

    return { formatted }
  } catch (error) {
    console.error("Error formatting code:", error)
    return {
      formatted: code,
      error: error instanceof Error ? error.message : "An error occurred during formatting",
    }
  }
}

/**
 * Get supported languages for formatting
 * @returns Array of language identifiers that can be formatted
 */
export function getSupportedFormattingLanguages(): string[] {
  return Object.keys(LANGUAGE_TO_PARSER)
}

/**
 * Check if a language is supported for formatting
 * @param language The language to check
 * @returns True if the language is supported for formatting
 */
export function isFormattingSupported(language: string): boolean {
  return language in LANGUAGE_TO_PARSER
}
