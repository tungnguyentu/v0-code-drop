// Language detection patterns
const LANGUAGE_PATTERNS = [
  {
    name: "javascript",
    patterns: [
      /\bconst\b|\blet\b|\bvar\b|\bfunction\b|\bimport\b|\bexport\b|\bclass\b|\bconsole\.log\b/g,
      /\bdocument\b|\bwindow\b|\bfetch\b|\basync\b|\bawait\b|\b=>\b/g,
      /\$$$'\w+'$$|\$$$"\w+"$$/g, // jQuery patterns
    ],
    extensions: [".js", ".jsx", ".mjs"],
  },
  {
    name: "typescript",
    patterns: [
      /\binterface\b|\btype\b|\bnamespace\b|\benum\b|\bimport\s+{\s*[\w\s,]+\s*}\s+from\b/g,
      /:\s*(string|number|boolean|any|unknown|never|void)\b/g,
      /<[A-Z]\w+>|\bReadonly<|\bPartial<|\bPick<|\bRecord</g,
    ],
    extensions: [".ts", ".tsx"],
  },
  {
    name: "html",
    patterns: [
      /<(!DOCTYPE|html|head|body|div|span|h[1-6]|p|a|img|ul|ol|li|table|form|input|button)/g,
      /<\/?(div|span|p|a|img|ul|ol|li|table|tr|td|th|form|input|button|html|head|body)>/g,
    ],
    extensions: [".html", ".htm"],
  },
  {
    name: "css",
    patterns: [
      /\b(body|html|div|span|p|a|h[1-6])\s*{/g,
      /@media\b|@import\b|@keyframes\b/g,
      /\b(margin|padding|border|font|color|background|display|position|width|height):/g,
    ],
    extensions: [".css"],
  },
  {
    name: "python",
    patterns: [
      /\bdef\s+\w+\s*$$|\bclass\s+\w+\s*(\([\w\s,]*$$)?:/g,
      /\bimport\s+\w+|\bfrom\s+\w+\s+import\b/g,
      /\bif\s+__name__\s*==\s*('|")__main__('|"):/g,
    ],
    extensions: [".py"],
  },
  {
    name: "java",
    patterns: [
      /\bpublic\s+(static\s+)?(class|void|int|String)\b/g,
      /\bprivate\b|\bprotected\b|\bimport\s+java\./g,
      /\bSystem\.out\.print(ln)?\(/g,
    ],
    extensions: [".java"],
  },
  {
    name: "csharp",
    patterns: [
      /\bnamespace\s+\w+(\.\w+)*\b/g,
      /\busing\s+\w+(\.\w+)*;/g,
      /\bpublic\s+(static\s+)?(class|void|int|string)\b/g,
      /\bConsole\.Write(Line)?\(/g,
    ],
    extensions: [".cs"],
  },
  {
    name: "php",
    patterns: [/<\?php|\becho\b|\bfunction\b/g, /\$\w+\s*=/g],
    extensions: [".php"],
  },
  {
    name: "ruby",
    patterns: [
      /\bdef\s+\w+\b|\bclass\s+\w+\b|\bmodule\s+\w+\b/g,
      /\brequire\b|\binclude\b|\battr_accessor\b/g,
      /\bputs\b|\bp\b/g,
    ],
    extensions: [".rb"],
  },
  {
    name: "go",
    patterns: [/\bfunc\s+\w+\s*\(|\bpackage\s+\w+\b/g, /\bimport\s+\(/g, /\bfmt\.Print(ln|f)?\(/g],
    extensions: [".go"],
  },
  {
    name: "rust",
    patterns: [/\bfn\s+\w+\s*\(|\blet\s+mut\b/g, /\bstruct\s+\w+\s*{|\benum\s+\w+\s*{/g, /\bimpl\b|\bpub\b|\buse\b/g],
    extensions: [".rs"],
  },
  {
    name: "json",
    patterns: [/^[\s\n]*{[\s\S]*}[\s\n]*$/g, /"[\w\s]+"\s*:\s*("[^"]*"|\d+|true|false|null|\{|\[)/g],
    extensions: [".json"],
  },
  {
    name: "markdown",
    patterns: [/^#\s+|\n#{1,6}\s+/g, /\*\*[\w\s]+\*\*|__[\w\s]+__/g, /\[[\w\s]+\]$$https?:\/\/[^\s)]+$$/g],
    extensions: [".md", ".markdown"],
  },
  {
    name: "yaml",
    patterns: [/^---[\s\S]*?(\n---|\n\.\.\.)/g, /^\w+:\s*$/gm, /^\s{2,}\w+:\s+/gm],
    extensions: [".yml", ".yaml"],
  },
  {
    name: "sql",
    patterns: [
      /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|GROUP BY|ORDER BY|HAVING)\b/gi,
      /\b(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|UNION|INTERSECT)\b/gi,
    ],
    extensions: [".sql"],
  },
  {
    name: "bash",
    patterns: [/^#!\/bin\/(ba)?sh/g, /\becho\b|\bexport\b|\bsource\b/g, /\$$$\w+$$|\$\{\w+\}/g],
    extensions: [".sh", ".bash"],
  },
]

/**
 * Detect the programming language from code content
 */
export function detectLanguage(content: string, filename?: string): string {
  if (!content || content.trim().length === 0) {
    return "plaintext"
  }

  // First try to detect from filename if provided
  if (filename) {
    const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase()
    for (const lang of LANGUAGE_PATTERNS) {
      if (lang.extensions.includes(extension)) {
        return lang.name
      }
    }
  }

  // Score each language based on pattern matches
  const scores: Record<string, number> = {}

  for (const lang of LANGUAGE_PATTERNS) {
    let score = 0
    for (const pattern of lang.patterns) {
      const matches = content.match(pattern)
      if (matches) {
        score += matches.length
      }
    }
    scores[lang.name] = score
  }

  // Find the language with the highest score
  let bestMatch = "plaintext"
  let highestScore = 0

  for (const [lang, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score
      bestMatch = lang
    }
  }

  // If the highest score is too low, default to plaintext
  if (highestScore < 2) {
    return "plaintext"
  }

  return bestMatch
}
