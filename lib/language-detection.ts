// Common language patterns and signatures
const LANGUAGE_PATTERNS = [
  {
    language: "javascript",
    patterns: [
      /\bconst\b|\blet\b|\bvar\b|\bfunction\b|\bimport\b.*\bfrom\b|\bexport\b|\bclass\b.*\bextends\b|\bconsole\.log\(/,
      /\bdocument\b|\bwindow\b|\bPromise\b|\basync\b.*\bawait\b/,
      /=>/,
      /\.then$$.*$$|\\.catch$$.*$$/,
    ],
    extensions: [".js", ".jsx", ".mjs"],
  },
  {
    language: "typescript",
    patterns: [
      /\binterface\b|\btype\b|\bnamespace\b|\benum\b|\bReadonly\b/,
      /:\s*(string|number|boolean|any|unknown|never|void)\b/,
      /<.*>/,
      /import\s+{\s*.*\s*}\s+from/,
    ],
    extensions: [".ts", ".tsx"],
  },
  {
    language: "html",
    patterns: [
      /<!DOCTYPE\s+html>|<html>|<\/html>|<head>|<\/head>|<body>|<\/body>/i,
      /<div>|<span>|<p>|<a\s+href|<img\s+src|<ul>|<li>/i,
      /<h[1-6]>|<\/h[1-6]>/i,
      /<script>|<style>|<link\s+rel="stylesheet"/i,
    ],
    extensions: [".html", ".htm"],
  },
  {
    language: "css",
    patterns: [
      /\b[.#][\w-]+\s*{/,
      /@media\b|@import\b|@keyframes\b/,
      /\b(margin|padding|border|font|color|background|display|position|width|height):/,
      /\b(flex|grid|box-shadow|transition|animation|transform):/,
    ],
    extensions: [".css"],
  },
  {
    language: "python",
    patterns: [
      /\bdef\b|\bclass\b|\bimport\b|\bfrom\b.*\bimport\b/,
      /\bif\b.*:|\bfor\b.*:|\bwhile\b.*:|\btry\b:|\bexcept\b:/,
      /\bprint\(|\brange\(|\blen\(/,
      /\bself\b|\b__init__\b|\b__main__\b/,
    ],
    extensions: [".py"],
  },
  {
    language: "java",
    patterns: [
      /\bpublic\b|\bprivate\b|\bprotected\b|\bclass\b|\binterface\b|\benum\b/,
      /\bextends\b|\bimplements\b|\bthrows\b|\btry\b|\bcatch\b|\bfinally\b/,
      /\bSystem\.out\.println\(|\bString\b|\bInteger\b|\bBoolean\b/,
      /@Override\b|@Deprecated\b/,
    ],
    extensions: [".java"],
  },
  {
    language: "csharp",
    patterns: [
      /\bnamespace\b|\busing\b.*?;|\bclass\b|\bpublic\b|\bprivate\b|\bprotected\b/,
      /\bvoid\b|\bstring\b|\bint\b|\bbool\b|\bvar\b/,
      /\bConsole\.Write|\bList<|\bDictionary<|\.NET\b/,
      /\basync\b.*\bawait\b|\bTask<|\bIEnumerable<|\bLINQ\b/,
    ],
    extensions: [".cs"],
  },
  {
    language: "go",
    patterns: [
      /\bpackage\b|\bimport\b|\bfunc\b|\bstruct\b|\binterface\b/,
      /\bgo\b|\bchan\b|\bdefer\b|\bselect\b/,
      /\bfmt\.Print|\bmap\[|\bmake\(|\bnew\(/,
      /\berror\b|\bnil\b|\biota\b/,
    ],
    extensions: [".go"],
  },
  {
    language: "rust",
    patterns: [
      /\bfn\b|\blet\b|\bmut\b|\bstruct\b|\benum\b|\bimpl\b|\btrait\b/,
      /\bmatch\b|\bOption<|\bResult<|\bSome\(|\bNone\b|\bOk\(|\bErr\(/,
      /\bpub\b|\buse\b|\bcrate\b|\bmod\b/,
      /\bvec!\b|\bprintln!\b|\bformat!\b/,
    ],
    extensions: [".rs"],
  },
  {
    language: "php",
    patterns: [
      /<\?php|\becho\b|\bfunction\b|\bclass\b|\bpublic\b|\bprivate\b/,
      /\$[a-zA-Z_][a-zA-Z0-9_]*\b/,
      /\barray\(|\bforeach\b|\bas\b/,
      /\bnew\b|\bextends\b|\bimplements\b/,
    ],
    extensions: [".php"],
  },
  {
    language: "ruby",
    patterns: [
      /\bdef\b|\bclass\b|\bmodule\b|\battr_accessor\b/,
      /\bend\b|\bdo\b|\|.*\|/,
      /\bputs\b|\brequire\b|\brequire_relative\b/,
      /\bnil\b|\btrue\b|\bfalse\b/,
    ],
    extensions: [".rb"],
  },
  {
    language: "sql",
    patterns: [
      /\bSELECT\b.*\bFROM\b|\bINSERT INTO\b|\bUPDATE\b.*\bSET\b|\bDELETE FROM\b/i,
      /\bWHERE\b|\bGROUP BY\b|\bORDER BY\b|\bJOIN\b/i,
      /\bCREATE TABLE\b|\bALTER TABLE\b|\bDROP TABLE\b/i,
      /\bINDEX\b|\bPRIMARY KEY\b|\bFOREIGN KEY\b/i,
    ],
    extensions: [".sql"],
  },
  {
    language: "json",
    patterns: [/^\s*{[\s\S]*}\s*$/, /"\w+":\s*(?:"[^"]*"|[\d.]+|true|false|null|\{|\[)/],
    extensions: [".json"],
  },
  {
    language: "yaml",
    patterns: [/^\s*[\w-]+:\s*.*$/m, /^\s*-\s+[\w-]+:\s*.*$/m, /^\s*-\s+.*$/m],
    extensions: [".yml", ".yaml"],
  },
  {
    language: "markdown",
    patterns: [
      /^#\s+.*$|^##\s+.*$|^###\s+.*$/m,
      /\*\*.*\*\*|__.*__|_.*_|\*.*\*/,
      /\[.*\]$$.*$$/,
      /^>\s+.*$|^-\s+.*$|^[0-9]+\.\s+.*$/m,
    ],
    extensions: [".md", ".markdown"],
  },
  {
    language: "bash",
    patterns: [
      /^#!/,
      /\becho\b|\bexport\b|\bsource\b|\balias\b/,
      /\$\{.*\}|\$$$.*$$|\$[a-zA-Z0-9_]+/,
      /\bif\b.*;\s*then\b|\bfor\b.*;\s*do\b|\bwhile\b.*;\s*do\b/,
    ],
    extensions: [".sh", ".bash"],
  },
  {
    language: "cpp",
    patterns: [
      /#include\s*<.*>|#include\s*".*"/,
      /\bstd::|::\b|\bnamespace\b|\btemplate\b/,
      /\bclass\b.*\{|\bstruct\b.*\{|\benum\b.*\{/,
      /\bconst\b|\bvoid\b|\bint\b|\bfloat\b|\bdouble\b|\bchar\b|\bbool\b/,
    ],
    extensions: [".cpp", ".cc", ".cxx", ".hpp", ".h"],
  },
  {
    language: "swift",
    patterns: [
      /\bfunc\b|\bvar\b|\blet\b|\bclass\b|\bstruct\b|\benum\b|\bprotocol\b/,
      /\bguard\b|\bif\b|\belse\b|\bswitch\b|\bcase\b/,
      /\bimport\b\s+\w+/,
      /\boptional\b|\bunwrap\b|\bnil\b/,
    ],
    extensions: [".swift"],
  },
  {
    language: "kotlin",
    patterns: [
      /\bfun\b|\bval\b|\bvar\b|\bclass\b|\bobject\b|\binterface\b/,
      /\bprivate\b|\bprotected\b|\bpublic\b|\binternal\b/,
      /\bimport\b\s+\w+/,
      /\bnull\b|\bnullable\b|\b\?\b/,
    ],
    extensions: [".kt", ".kts"],
  },
]

/**
 * Detects the programming language from code content
 * @param content The code content to analyze
 * @param filename Optional filename which can help with detection via extension
 * @returns The detected language or 'plaintext' if no match
 */
export function detectLanguage(content: string, filename?: string): string {
  if (!content || content.trim().length === 0) {
    return "plaintext"
  }

  // First try to detect by filename extension if provided
  if (filename) {
    const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase()
    for (const lang of LANGUAGE_PATTERNS) {
      if (lang.extensions.includes(extension)) {
        return lang.language
      }
    }
  }

  // Create a scoring system for each language
  const scores: Record<string, number> = {}

  // Initialize scores
  LANGUAGE_PATTERNS.forEach((lang) => {
    scores[lang.language] = 0
  })

  // Check each language's patterns against the content
  LANGUAGE_PATTERNS.forEach((lang) => {
    lang.patterns.forEach((pattern) => {
      if (pattern.test(content)) {
        scores[lang.language] += 1
      }
    })
  })

  // Find the language with the highest score
  let bestMatch = "plaintext"
  let highestScore = 0

  for (const [language, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score
      bestMatch = language
    }
  }

  // Only return a match if we have some confidence (at least 2 patterns matched)
  return highestScore >= 2 ? bestMatch : "plaintext"
}
