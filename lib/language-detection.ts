/**
 * Advanced language detection for code snippets
 * Uses a combination of tokenization, pattern matching, and weighted scoring
 */

// Language definition with comprehensive patterns and metadata
interface LanguageDefinition {
  name: string
  extensions: string[]
  // Different types of patterns with weights
  patterns: {
    // Strong indicators (very specific to a language)
    strong: RegExp[]
    // Medium indicators (common in the language but might appear elsewhere)
    medium: RegExp[]
    // Weak indicators (syntax elements that appear in multiple languages)
    weak: RegExp[]
    // Negative indicators (patterns that suggest it's NOT this language)
    negative: RegExp[]
  }
  // Special tokens that are highly indicative of a language
  keywords: string[]
  // Common file names for this language
  fileNames?: string[]
  // Comment styles
  comments?: {
    line?: string[]
    block?: { start: string; end: string }[]
  }
}

// Comprehensive language definitions with weighted patterns
const LANGUAGE_DEFINITIONS: LanguageDefinition[] = [
  {
    name: "javascript",
    extensions: [".js", ".jsx", ".mjs", ".cjs"],
    patterns: {
      strong: [
        // ES6+ features
        /\bconst\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=|async\s+function|await\s+\w+/g,
        // JS frameworks
        /\breact\b|\bangular\b|\bvue\b|\bnext\b|\bexpress\b|\bnode\b/gi,
        // DOM manipulation
        /document\.querySelector|document\.getElementById|window\./g,
        // JS specific syntax
        /$$\s*$$\s*=>\s*{|$$\s*$$\s*=>\s*\(|\bfunction\s*\*|\byield\b/g,
        // Common JS patterns
        /console\.log\(|new Promise\(|setTimeout\(|fetch\(.*\.then\(/g,
        // Module syntax
        /\bimport\s+{\s*[\w\s,]+\s*}\s+from\s+['"]|export\s+(default\s+)?(\w+|\{)/g,
        // JSX
        /<[A-Z]\w+(\s+\w+={.*?})*\s*>|<\/[A-Z]\w+>/g,
      ],
      medium: [
        // General JS syntax that might appear in other languages
        /\bfunction\b|\breturn\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\bswitch\b|\bcase\b/g,
        // Object/array syntax
        /{\s*[\w]+\s*:\s*[^}]+\s*}|\[[^\]]*\]/g,
        // String templates
        /`[^`]*`|\${\w+}/g,
      ],
      weak: [
        // Common to many languages
        /\btrue\b|\bfalse\b|\bnull\b|\bundefined\b/g,
        // Operators
        /===|!==|&&|\|\|/g,
      ],
      negative: [
        // Patterns that suggest it's not JavaScript
        /\bfunc\s+\w+\(|\bpackage\s+\w+\b|\bimport\s+\w+\b|\bpublic\s+class\b/g,
      ],
    },
    keywords: [
      "const",
      "let",
      "var",
      "function",
      "async",
      "await",
      "class",
      "export",
      "import",
      "from",
      "return",
      "yield",
      "typeof",
      "instanceof",
      "undefined",
      "Promise",
      "Array",
      "Object",
      "Map",
      "Set",
      "Symbol",
      "Proxy",
      "JSON",
      "Math",
      "console",
    ],
    comments: {
      line: ["//"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "typescript",
    extensions: [".ts", ".tsx", ".d.ts"],
    patterns: {
      strong: [
        // TS-specific syntax
        /\binterface\s+\w+\s*{|\btype\s+\w+\s*=|\bnamespace\s+\w+\s*{|\benum\s+\w+\s*{/g,
        // TS type annotations
        /:\s*(string|number|boolean|any|unknown|never|void|object|null|undefined)\b/g,
        // TS generics
        /<[A-Z]\w+>|\bReadonly<|\bPartial<|\bPick<|\bRecord<|\bExtract<|\bExclude<|\bOmit</g,
        // TS decorators
        /@\w+($$.*?$$)?/g,
        // TS-specific keywords
        /\bdeclare\b|\bmodule\b|\bimplements\b|\bextends\b|\bprivate\b|\bprotected\b|\bpublic\b|\breadonly\b/g,
      ],
      medium: [
        // Shared with JS but common in TS
        /\bclass\b|\bconstructor\b|\bsuper\b|\bthis\./g,
        // Import/export syntax
        /\bimport\s+{\s*[\w\s,]+\s*}\s+from\s+['"]|export\s+(default\s+)?(\w+|\{)/g,
      ],
      weak: [
        // Common to many languages
        /\bfunction\b|\breturn\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\bswitch\b|\bcase\b/g,
      ],
      negative: [
        // Patterns that suggest it's not TypeScript
        /\bfunc\s+\w+\(|\bpackage\s+\w+\b|\bdef\s+\w+\(|\bfn\s+\w+\(/g,
      ],
    },
    keywords: [
      "interface",
      "type",
      "namespace",
      "enum",
      "declare",
      "module",
      "implements",
      "extends",
      "private",
      "protected",
      "public",
      "readonly",
      "abstract",
      "static",
      "as",
      "keyof",
      "typeof",
      "infer",
      "is",
      "never",
      "unknown",
      "any",
    ],
    comments: {
      line: ["//"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "html",
    extensions: [".html", ".htm", ".xhtml"],
    patterns: {
      strong: [
        // HTML doctype and structure
        /<!DOCTYPE\s+html>|<html[^>]*>|<\/html>|<head>|<\/head>|<body[^>]*>|<\/body>/gi,
        // Common HTML tags
        /<(div|span|p|a|img|ul|ol|li|table|tr|td|th|form|input|button|h[1-6]|section|article|nav|footer|header)(\s+[^>]*)?>/gi,
        // HTML attributes
        /\s+(class|id|style|href|src|alt|title|width|height|data-\w+)=["'][^"']*["']/g,
      ],
      medium: [
        // General HTML elements
        /<\w+>|<\/\w+>|<\w+\s+[^>]*\/>/g,
        // HTML comments
        /<!--[\s\S]*?-->/g,
      ],
      weak: [
        // Could be in other XML-like formats
        /<[^>]+>/g,
      ],
      negative: [
        // Patterns that suggest it's not HTML
        /\bfunction\b|\bclass\b|\bimport\b|\bpackage\b|\bpublic\b|\bprivate\b/g,
      ],
    },
    keywords: [
      "html",
      "head",
      "body",
      "div",
      "span",
      "p",
      "a",
      "img",
      "script",
      "style",
      "link",
      "meta",
      "title",
      "h1",
      "h2",
      "ul",
      "ol",
      "li",
      "table",
      "form",
      "input",
    ],
    comments: {
      block: [{ start: "<!--", end: "-->" }],
    },
  },
  {
    name: "css",
    extensions: [".css", ".scss", ".less"],
    patterns: {
      strong: [
        // CSS selectors
        /[.#]?[\w-]+\s*{[^}]*}/g,
        // CSS properties
        /\b(margin|padding|border|font|color|background|display|position|width|height|top|left|right|bottom|flex|grid|animation|transition):/g,
        // CSS values
        /:\s*(#[0-9a-f]{3,8}|rgba?$$[^)]+$$|hsla?$$[^)]+$$|[0-9]+px|[0-9]+em|[0-9]+rem|[0-9]+vh|[0-9]+vw|auto|none|flex|block|inline|hidden)/gi,
        // CSS at-rules
        /@media\s+[^{]+{|@keyframes\s+\w+\s*{|@import\s+['"][^'"]+['"];|@font-face\s*{/g,
      ],
      medium: [
        // General CSS syntax
        /\s*{\s*[^}]*\s*}/g,
        // CSS comments
        /\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Could be in other languages
        /;/g,
      ],
      negative: [
        // Patterns that suggest it's not CSS
        /\bfunction\b|\bclass\b|\bif\b|\bfor\b|\bwhile\b/g,
      ],
    },
    keywords: [
      "margin",
      "padding",
      "border",
      "color",
      "background",
      "font-size",
      "display",
      "position",
      "width",
      "height",
      "flex",
      "grid",
      "animation",
      "transition",
      "hover",
      "active",
      "focus",
      "before",
      "after",
      "media",
      "keyframes",
      "import",
    ],
    comments: {
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "python",
    extensions: [".py", ".pyw", ".pyc", ".pyo", ".pyd"],
    patterns: {
      strong: [
        // Python function and class definitions
        /\bdef\s+\w+\s*$$.*?$$:\s*$|\bclass\s+\w+(\s*$$.*?$$)?:\s*$/gm,
        // Python imports
        /\bimport\s+\w+(\.\w+)*|\bfrom\s+\w+(\.\w+)*\s+import\s+/g,
        // Python decorators
        /@\w+(\.\w+)*($$.*?$$)?/g,
        // Python specific syntax
        /\bif\s+__name__\s*==\s*('|")__main__('|"):/g,
        // Python string formats
        /f(['"])[^'"]*\{[^}]*\}[^'"]*\1|(['"])[^'"]*\1\s*%\s*\(/g,
        // Python list/dict comprehensions
        /\[\s*\w+(\s+for\s+\w+\s+in\s+\w+(\s+if\s+[^]]+)?)\s*\]|\{\s*\w+:\s*\w+(\s+for\s+\w+\s+in\s+\w+(\s+if\s+[^}]+)?)\s*\}/g,
      ],
      medium: [
        // Python control flow
        /\bif\s+.*?:\s*$|\belif\s+.*?:\s*$|\belse\s*:\s*$|\bfor\s+.*?\s+in\s+.*?:\s*$|\bwhile\s+.*?:\s*$|\btry\s*:\s*$|\bexcept(\s+\w+)?(\s+as\s+\w+)?:\s*$|\bfinally\s*:\s*$/gm,
        // Python indentation
        /^\s{4}\w+/gm,
        // Python comments
        /#.*/g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\bTrue\b|\bFalse\b|\bNone\b/g,
      ],
      negative: [
        // Patterns that suggest it's not Python
        /\b(function|var|const|let)\b|\b\w+\s*{\s*|\b(public|private)\s+class\b/g,
      ],
    },
    keywords: [
      "def",
      "class",
      "import",
      "from",
      "as",
      "if",
      "elif",
      "else",
      "for",
      "in",
      "while",
      "try",
      "except",
      "finally",
      "with",
      "return",
      "yield",
      "lambda",
      "True",
      "False",
      "None",
      "self",
      "print",
      "len",
      "range",
      "list",
      "dict",
      "set",
    ],
    comments: {
      line: ["#"],
    },
  },
  {
    name: "java",
    extensions: [".java", ".class", ".jar"],
    patterns: {
      strong: [
        // Java class and method definitions
        /\bpublic\s+(static\s+)?(final\s+)?(class|interface|enum)\s+\w+/g,
        /\b(public|private|protected)(\s+static)?(\s+final)?\s+\w+(<.*?>)?\s+\w+\s*\(/g,
        // Java imports
        /\bimport\s+\w+(\.\w+)*(\.\*)?\s*;/g,
        // Java package declaration
        /\bpackage\s+\w+(\.\w+)*\s*;/g,
        // Java annotations
        /@\w+($$.*?$$)?/g,
        // Java specific syntax
        /\bSystem\.out\.print(ln)?\(/g,
        /\bnew\s+\w+(\s*<.*?>)?\s*\(/g,
      ],
      medium: [
        // Java control flow
        /\bif\s*$$.*?$$|\belse\s*\{|\bfor\s*$$.*?$$|\bwhile\s*$$.*?$$|\bswitch\s*$$.*?$$|\bcase\s+.*?:/g,
        // Java exception handling
        /\btry\s*\{|\bcatch\s*$$.*?$$|\bfinally\s*\{|\bthrow\s+new\s+/g,
        // Java comments
        /\/\/.*|\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\btrue\b|\bfalse\b|\bnull\b/g,
        // Braces and semicolons
        /[{}();]/g,
      ],
      negative: [
        // Patterns that suggest it's not Java
        /\bfunc\b|\bdef\b|\blet\b|\bconst\b|\bvar\b|\bimport\s+React\b/g,
      ],
    },
    keywords: [
      "public",
      "private",
      "protected",
      "class",
      "interface",
      "enum",
      "extends",
      "implements",
      "static",
      "final",
      "void",
      "abstract",
      "new",
      "this",
      "super",
      "import",
      "package",
      "try",
      "catch",
      "finally",
      "throw",
      "throws",
      "instanceof",
    ],
    comments: {
      line: ["//"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "csharp",
    extensions: [".cs", ".csx"],
    patterns: {
      strong: [
        // C# class and method definitions
        /\b(public|private|protected|internal)(\s+static)?(\s+readonly)?(\s+async)?\s+\w+(<.*?>)?\s+\w+\s*\(/g,
        /\b(public|private|protected|internal)(\s+static)?(\s+abstract)?(\s+sealed)?\s+(class|interface|enum|struct)\s+\w+/g,
        // C# namespace
        /\bnamespace\s+\w+(\.\w+)*\s*\{/g,
        // C# using directives
        /\busing\s+\w+(\.\w+)*\s*;|\busing\s+static\s+\w+(\.\w+)*\s*;/g,
        // C# attributes
        /\[\s*\w+(\s*$$.*?$$)?\s*\]/g,
        // C# specific syntax
        /\bConsole\.Write(Line)?\(/g,
        /\bvar\s+\w+\s*=|\bawait\s+\w+/g,
        // C# LINQ
        /\bfrom\s+\w+\s+in\s+\w+(\.\w+)*\s+select\s+/g,
      ],
      medium: [
        // C# control flow
        /\bif\s*$$.*?$$|\belse\s*\{|\bfor\s*$$.*?$$|\bforeach\s*$$.*?$$|\bwhile\s*$$.*?$$|\bswitch\s*$$.*?$$|\bcase\s+.*?:/g,
        // C# exception handling
        /\btry\s*\{|\bcatch\s*$$.*?$$|\bfinally\s*\{|\bthrow\s+new\s+/g,
        // C# comments
        /\/\/.*|\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\btrue\b|\bfalse\b|\bnull\b/g,
        // Braces and semicolons
        /[{}();]/g,
      ],
      negative: [
        // Patterns that suggest it's not C#
        /\bfunc\b|\bdef\b|\blet\b|\bconst\b|\bimport\s+React\b|\bpackage\s+\w+\b/g,
      ],
    },
    keywords: [
      "public",
      "private",
      "protected",
      "internal",
      "class",
      "interface",
      "enum",
      "struct",
      "namespace",
      "using",
      "static",
      "readonly",
      "const",
      "var",
      "async",
      "await",
      "void",
      "string",
      "int",
      "bool",
      "object",
      "delegate",
      "event",
      "new",
    ],
    comments: {
      line: ["//"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "php",
    extensions: [".php", ".phtml", ".php3", ".php4", ".php5", ".phps"],
    patterns: {
      strong: [
        // PHP opening and closing tags
        /<\?php|\?>/g,
        // PHP function and class definitions
        /\bfunction\s+\w+\s*$$.*?$$(\s*:\s*\w+)?(\s*use\s*$$.*?$$)?\s*\{/g,
        /\b(public|private|protected)(\s+static)?\s+function\s+\w+\s*\(/g,
        /\bclass\s+\w+(\s+extends\s+\w+)?(\s+implements\s+\w+(\s*,\s*\w+)*)?\s*\{/g,
        // PHP variables
        /\$\w+/g,
        // PHP specific syntax
        /\becho\b|\bprint\b|\binclude(_once)?\b|\brequire(_once)?\b/g,
        // PHP array syntax
        /array\s*$$.*?$$|\[.*?\]\s*=>/g,
      ],
      medium: [
        // PHP control flow
        /\bif\s*$$.*?$$|\belse\s*\{|\bfor\s*$$.*?$$|\bforeach\s*$$.*?\s+as\s+.*?$$|\bwhile\s*$$.*?$$|\bswitch\s*$$.*?$$|\bcase\s+.*?:/g,
        // PHP comments
        /\/\/.*|#.*|\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\btrue\b|\bfalse\b|\bnull\b/g,
        // Braces and semicolons
        /[{}();]/g,
      ],
      negative: [
        // Patterns that suggest it's not PHP
        /\bfunc\b|\bdef\b|\bimport\s+React\b|\bpackage\s+\w+\b/g,
      ],
    },
    keywords: [
      "function",
      "class",
      "public",
      "private",
      "protected",
      "echo",
      "print",
      "include",
      "require",
      "include_once",
      "require_once",
      "array",
      "foreach",
      "as",
      "new",
      "this",
      "extends",
      "implements",
      "namespace",
      "use",
      "trait",
    ],
    comments: {
      line: ["//", "#"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "ruby",
    extensions: [".rb", ".rbw", ".rake", ".gemspec", ".rbx", ".duby"],
    patterns: {
      strong: [
        // Ruby method and class definitions
        /\bdef\s+\w+(\s*$$.*?$$)?(\s*\|.*?\|)?/g,
        /\bclass\s+\w+(\s*<\s*\w+)?/g,
        /\bmodule\s+\w+/g,
        // Ruby specific syntax
        /\battr_accessor\b|\battr_reader\b|\battr_writer\b/g,
        /\brequire\b|\brequire_relative\b|\binclude\b|\bextend\b/g,
        /\bputs\b|\bp\b|\bprint\b/g,
        // Ruby symbols and blocks
        /:\w+|\bdo\s*(\|.*?\|)?/g,
        // Ruby string interpolation
        /#\{[^}]*\}/g,
      ],
      medium: [
        // Ruby control flow
        /\bif\s+.*?|\bunless\s+.*?|\belse\s*|\belif\s+.*?|\bcase\s+.*?|\bwhen\s+.*?|\bwhile\s+.*?|\buntil\s+.*?|\bfor\s+.*?\s+in\s+.*?/g,
        // Ruby comments
        /#.*/g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\btrue\b|\bfalse\b|\bnil\b/g,
        // Ruby end keyword
        /\bend\b/g,
      ],
      negative: [
        // Patterns that suggest it's not Ruby
        /\bfunction\b|\bvar\b|\bconst\b|\blet\b|\bpublic\s+class\b/g,
      ],
    },
    keywords: [
      "def",
      "class",
      "module",
      "attr_accessor",
      "attr_reader",
      "attr_writer",
      "require",
      "include",
      "extend",
      "puts",
      "print",
      "if",
      "else",
      "elsif",
      "unless",
      "case",
      "when",
      "while",
      "until",
      "for",
      "in",
      "do",
      "end",
      "self",
    ],
    comments: {
      line: ["#"],
    },
  },
  {
    name: "go",
    extensions: [".go"],
    patterns: {
      strong: [
        // Go function and type definitions
        /\bfunc\s+\w+\s*$$.*?$$(\s+\w+)?/g,
        /\btype\s+\w+\s+(struct|interface)\s*\{/g,
        // Go package declaration
        /\bpackage\s+\w+/g,
        // Go imports
        /\bimport\s+\(/g,
        /\bimport\s+["'][\w/.]+["']/g,
        // Go specific syntax
        /\bgo\s+\w+\(|\bchan\b|\bselect\s*\{|\bdefer\b|\bpanic\b|\brecover\b/g,
        /\bfmt\.Print(ln|f)?\(/g,
      ],
      medium: [
        // Go control flow
        /\bif\s+.*?\{|\belse\s*\{|\bfor\s+.*?\{|\bswitch\s+.*?\{|\bcase\s+.*?:/g,
        // Go variable declarations
        /\bvar\s+\w+\s+\w+|\bconst\s+\w+\s+\w+/g,
        // Go short variable declarations
        /\w+\s*:=\s*/g,
        // Go comments
        /\/\/.*|\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\btrue\b|\bfalse\b|\bnil\b/g,
        // Braces and semicolons
        /[{}();]/g,
      ],
      negative: [
        // Patterns that suggest it's not Go
        /\bfunction\b|\bclass\b|\bdef\b|\bvar\s+\w+\s*=|\blet\b|\bconst\s+\w+\s*=/g,
      ],
    },
    keywords: [
      "func",
      "type",
      "struct",
      "interface",
      "package",
      "import",
      "go",
      "chan",
      "select",
      "defer",
      "panic",
      "recover",
      "map",
      "slice",
      "make",
      "new",
      "if",
      "else",
      "for",
      "range",
      "switch",
      "case",
      "default",
      "var",
      "const",
      "return",
    ],
    comments: {
      line: ["//"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "rust",
    extensions: [".rs", ".rlib"],
    patterns: {
      strong: [
        // Rust function and type definitions
        /\bfn\s+\w+\s*(<.*?>)?\s*$$.*?$$(\s*->\s*.*?)?\s*\{/g,
        /\bstruct\s+\w+\s*(<.*?>)?\s*\{/g,
        /\benum\s+\w+\s*\{/g,
        /\btrait\s+\w+\s*(<.*?>)?\s*\{/g,
        /\bimpl\s+(\w+|<.*?>)?\s*(\bfor\s+\w+\s*(<.*?>)?)?\s*\{/g,
        // Rust specific syntax
        /\blet\s+mut\b|\bmatch\b|\bpub\b|\buse\b|\bcrate\b|\bmod\b/g,
        /\bRust\b|\bcargo\b|\btoml\b/gi,
        // Rust macros
        /\b\w+!\s*\(/g,
        // Rust lifetimes
        /'\w+/g,
      ],
      medium: [
        // Rust control flow
        /\bif\s+.*?\{|\belse\s*\{|\bfor\s+.*?\s+in\s+.*?\{|\bwhile\s+.*?\{|\bloop\s*\{/g,
        // Rust variable declarations
        /\blet\s+\w+(\s*:\s*.*?)?\s*=/g,
        // Rust comments
        /\/\/.*|\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Common to many languages
        /\breturn\b|\btrue\b|\bfalse\b|\bself\b/g,
        // Braces and semicolons
        /[{}();]/g,
      ],
      negative: [
        // Patterns that suggest it's not Rust
        /\bfunction\b|\bclass\b|\bdef\b|\bvar\b|\bconst\s+\w+\s*=|\bpackage\s+\w+\b/g,
      ],
    },
    keywords: [
      "fn",
      "struct",
      "enum",
      "trait",
      "impl",
      "for",
      "let",
      "mut",
      "match",
      "pub",
      "use",
      "crate",
      "mod",
      "self",
      "Self",
      "where",
      "unsafe",
      "async",
      "await",
      "move",
      "dyn",
      "ref",
      "static",
      "const",
      "type",
      "if",
      "else",
      "loop",
      "while",
    ],
    comments: {
      line: ["//"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "json",
    extensions: [".json", ".jsonc", ".json5"],
    patterns: {
      strong: [
        // JSON structure
        /^[\s\n]*{[\s\S]*}[\s\n]*$/g,
        // JSON property-value pairs
        /"[\w\s]+"\s*:\s*("[^"]*"|\d+|true|false|null|\{|\[)/g,
        // JSON arrays
        /"[\w\s]+"\s*:\s*\[[\s\S]*?\]/g,
      ],
      medium: [
        // JSON syntax elements
        /\{|\}|\[|\]|,|:/g,
        // JSON values
        /"[^"]*"|\d+|true|false|null/g,
      ],
      weak: [],
      negative: [
        // Patterns that suggest it's not JSON
        /\bfunction\b|\bclass\b|\bif\b|\bfor\b|\bwhile\b|\bvar\b|\blet\b|\bconst\b/g,
        // Comments (not in standard JSON)
        /\/\/.*|\/\*[\s\S]*?\*\//g,
      ],
    },
    keywords: ["true", "false", "null"],
  },
  {
    name: "markdown",
    extensions: [".md", ".markdown", ".mdown", ".mkdn"],
    patterns: {
      strong: [
        // Markdown headers
        /^#\s+.*$|^##\s+.*$|^###\s+.*$/gm,
        // Markdown lists
        /^[\s]*[-*+]\s+.*$|^[\s]*\d+\.\s+.*$/gm,
        // Markdown links and images
        /\[.*?\]$$.*?$$|!\[.*?\]$$.*?$$/g,
        // Markdown code blocks
        /```[\s\S]*?```|`[^`]+`/g,
        // Markdown blockquotes
        /^>\s+.*$/gm,
      ],
      medium: [
        // Markdown emphasis
        /\*\*.*?\*\*|__.*?__|_.*?_|\*.*?\*/g,
        // Markdown horizontal rules
        /^[\s]*[-*_]{3,}[\s]*$/gm,
      ],
      weak: [
        // Could be in plain text
        /\[|\]|$$|$$|#|>|-|\*/g,
      ],
      negative: [
        // Patterns that suggest it's not Markdown
        /\bfunction\b|\bclass\b|\bif\b|\bfor\b|\bwhile\b|\bvar\b|\blet\b|\bconst\b/g,
      ],
    },
    keywords: ["#", "##", "###", "-", "*", ">", "```", "**", "__", "[", "]", "(", ")"],
  },
  {
    name: "yaml",
    extensions: [".yml", ".yaml"],
    patterns: {
      strong: [
        // YAML document markers
        /^---(\s.*)?$|^\.\.\.(\s.*)?$/gm,
        // YAML key-value pairs
        /^[\s-]*[\w-]+:\s+.+$/gm,
        // YAML lists
        /^[\s-]*-\s+.+$/gm,
        // YAML anchors and aliases
        /&\w+|\*\w+/g,
      ],
      medium: [
        // YAML nested structures
        /^[\s]{2,}[\w-]+:\s+.+$/gm,
        // YAML comments
        /#.*/g,
      ],
      weak: [
        // Could be in other formats
        /:/g,
      ],
      negative: [
        // Patterns that suggest it's not YAML
        /\bfunction\b|\bclass\b|\bif\b|\bfor\b|\bwhile\b|\bvar\b|\blet\b|\bconst\b/g,
        // Braces (rare in YAML)
        /{|}|\[|\]/g,
      ],
    },
    keywords: ["---", "...", "true", "false", "null", "~"],
    comments: {
      line: ["#"],
    },
  },
  {
    name: "sql",
    extensions: [".sql"],
    patterns: {
      strong: [
        // SQL statements
        /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|COMMIT|ROLLBACK)\b/gi,
        // SQL clauses
        /\b(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|UNION|INTERSECT|EXCEPT)\b/gi,
        // SQL functions and operators
        /\b(COUNT|SUM|AVG|MIN|MAX|DISTINCT|AS|IN|BETWEEN|LIKE|IS NULL|IS NOT NULL|AND|OR|NOT)\b/gi,
        // SQL data types
        /\b(INT|INTEGER|SMALLINT|BIGINT|DECIMAL|NUMERIC|FLOAT|REAL|DOUBLE|CHAR|VARCHAR|TEXT|DATE|TIME|TIMESTAMP|BOOLEAN)\b/gi,
      ],
      medium: [
        // SQL syntax elements
        /;|$$|$$|,/g,
        // SQL comments
        /--.*|\/\*[\s\S]*?\*\//g,
      ],
      weak: [
        // Could be in other languages
        /=/g,
      ],
      negative: [
        // Patterns that suggest it's not SQL
        /\bfunction\b|\bclass\b|\bif\s*\(|\bfor\s*\(|\bwhile\s*\(|\bvar\b|\blet\b|\bconst\b/g,
      ],
    },
    keywords: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE",
      "CREATE",
      "ALTER",
      "DROP",
      "FROM",
      "WHERE",
      "GROUP",
      "BY",
      "HAVING",
      "ORDER",
      "LIMIT",
      "JOIN",
      "INNER",
      "LEFT",
      "RIGHT",
      "FULL",
      "UNION",
      "TABLE",
      "INDEX",
      "VIEW",
      "PROCEDURE",
      "FUNCTION",
    ],
    comments: {
      line: ["--"],
      block: [{ start: "/*", end: "*/" }],
    },
  },
  {
    name: "bash",
    extensions: [".sh", ".bash", ".zsh", ".ksh"],
    patterns: {
      strong: [
        // Bash shebang
        /^#!\/bin\/(ba)?sh/g,
        // Bash commands
        /\b(echo|export|source|alias|unalias|set|unset|eval|exec|cd|pwd|ls|mkdir|rm|cp|mv|chmod|chown|grep|sed|awk|find|xargs)\b/g,
        // Bash variables
        /\$\w+|\$\{\w+\}|\$$$\w+$$/g,
        // Bash control structures
        /\bif\s+\[\s+.*\s+\]|\bfor\s+\w+\s+in\s+|\bwhile\s+\[\s+.*\s+\]|\bcase\s+\$\w+\s+in\b/g,
        // Bash functions
        /\b\w+\s*$$\s*$$\s*\{/g,
      ],
      medium: [
        // Bash syntax elements
        /\[\s+.*\s+\]|\$$$.*$$/g,
        // Bash comments
        /#.*/g,
      ],
      weak: [
        // Could be in other languages
        /;/g,
      ],
      negative: [
        // Patterns that suggest it's not Bash
        /\bfunction\b|\bclass\b|\bdef\b|\bvar\b|\blet\s+\w+\s*=|\bconst\s+\w+\s*=/g,
      ],
    },
    keywords: [
      "echo",
      "export",
      "source",
      "alias",
      "set",
      "unset",
      "if",
      "then",
      "else",
      "elif",
      "fi",
      "for",
      "in",
      "do",
      "done",
      "while",
      "until",
      "case",
      "esac",
      "function",
      "return",
      "exit",
      "trap",
      "read",
      "shift",
      "test",
      "true",
      "false",
    ],
    comments: {
      line: ["#"],
    },
  },
  {
    name: "plaintext",
    extensions: [".txt"],
    patterns: {
      strong: [],
      medium: [],
      weak: [],
      negative: [
        // If we see any programming constructs, it's probably not plaintext
        /\bfunction\b|\bclass\b|\bif\b|\bfor\b|\bwhile\b|\bvar\b|\blet\b|\bconst\b/g,
        /\bdef\b|\bimport\b|\bpackage\b|\bpublic\b|\bprivate\b|\bprotected\b/g,
        /<html>|<body>|<div>|<script>|<style>/gi,
        /\[\s*\w+\s*\]|\{\s*\w+\s*:/g,
      ],
    },
    keywords: [],
  },
]

// Confidence thresholds for language detection
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.7, // Very confident
  MEDIUM: 0.5, // Reasonably confident
  LOW: 0.3, // Somewhat confident
  MINIMUM: 0.1, // Barely confident
}

/**
 * Tokenize code to analyze its structure
 * This is a simple tokenizer that identifies common code elements
 */
function tokenizeCode(code: string) {
  // Remove comments to avoid skewing the analysis
  const noComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\/|#.*/g, "")

  const tokens = {
    keywords: [] as string[],
    identifiers: [] as string[],
    strings: [] as string[],
    numbers: [] as string[],
    operators: [] as string[],
    punctuation: [] as string[],
    whitespace: 0,
    lines: 0,
  }

  // Count lines
  tokens.lines = code.split("\n").length

  // Count whitespace
  tokens.whitespace = (code.match(/\s/g) || []).length

  // Extract strings
  const stringMatches = noComments.match(/(['"`])(?:\\.|[^\\])*?\1/g) || []
  tokens.strings = stringMatches

  // Extract numbers
  const numberMatches = noComments.match(/\b\d+(\.\d+)?\b/g) || []
  tokens.numbers = numberMatches

  // Extract operators
  const operatorMatches = noComments.match(/[+\-*/%=&|^<>!~?:]+/g) || []
  tokens.operators = operatorMatches

  // Extract punctuation
  const punctuationMatches = noComments.match(/[{}()[\],.;]/g) || []
  tokens.punctuation = punctuationMatches

  // Extract identifiers and keywords (simplified)
  const wordMatches = noComments.match(/\b[a-zA-Z_]\w*\b/g) || []
  tokens.identifiers = wordMatches

  return tokens
}

/**
 * Extract potential language-specific features from code
 */
function extractFeatures(code: string) {
  const features = {
    indentation: {
      spaces: 0,
      tabs: 0,
    },
    brackets: {
      curly: 0,
      square: 0,
      round: 0,
      angle: 0,
    },
    semicolons: 0,
    hasShebang: false,
    hasDoctypeHtml: false,
    hasXmlDeclaration: false,
  }

  // Check for shebang
  features.hasShebang = /^#!.*/.test(code)

  // Check for HTML doctype
  features.hasDoctypeHtml = /<!DOCTYPE\s+html>/i.test(code)

  // Check for XML declaration
  features.hasXmlDeclaration = /<?xml\s+version=/i.test(code)

  // Count indentation types
  const indentMatches = code.match(/^( +|\t+)/gm) || []
  for (const indent of indentMatches) {
    if (indent.includes("\t")) {
      features.indentation.tabs++
    } else {
      features.indentation.spaces++
    }
  }

  // Count bracket types
  features.brackets.curly = (code.match(/{/g) || []).length
  features.brackets.square = (code.match(/\[/g) || []).length
  features.brackets.round = (code.match(/\(/g) || []).length
  features.brackets.angle = (code.match(/</g) || []).length

  // Count semicolons
  features.semicolons = (code.match(/;/g) || []).length

  return features
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Calculate a confidence score for a language based on pattern matches
 */
function calculateLanguageScore(
  code: string,
  language: LanguageDefinition,
  tokens: ReturnType<typeof tokenizeCode>,
  features: ReturnType<typeof extractFeatures>,
): { score: number; matchDetails: any } {
  let score = 0
  const matchDetails = {
    strongMatches: [] as string[],
    mediumMatches: [] as string[],
    weakMatches: [] as string[],
    negativeMatches: [] as string[],
    keywordMatches: [] as string[],
    extensionMatch: false,
    commentStyleMatch: false,
    featureMatches: {} as Record<string, boolean>,
  }

  // Check for strong pattern matches (highest weight)
  for (const pattern of language.patterns.strong) {
    const matches = code.match(pattern) || []
    if (matches.length > 0) {
      score += matches.length * 3
      matchDetails.strongMatches.push(...matches)
    }
  }

  // Check for medium pattern matches
  for (const pattern of language.patterns.medium) {
    const matches = code.match(pattern) || []
    if (matches.length > 0) {
      score += matches.length * 1.5
      matchDetails.mediumMatches.push(...matches)
    }
  }

  // Check for weak pattern matches
  for (const pattern of language.patterns.weak) {
    const matches = code.match(pattern) || []
    if (matches.length > 0) {
      score += matches.length * 0.5
      matchDetails.weakMatches.push(...matches)
    }
  }

  // Check for negative pattern matches (subtract from score)
  for (const pattern of language.patterns.negative) {
    const matches = code.match(pattern) || []
    if (matches.length > 0) {
      score -= matches.length * 2
      matchDetails.negativeMatches.push(...matches)
    }
  }

  // Check for keyword matches - safely create regex
  for (const keyword of language.keywords) {
    try {
      // Escape special regex characters and create a word boundary regex
      const escapedKeyword = escapeRegExp(keyword)
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, "g")
      const matches = code.match(regex) || []
      if (matches.length > 0) {
        score += matches.length * 1
        matchDetails.keywordMatches.push(keyword)
      }
    } catch (error) {
      // Skip this keyword if regex creation fails
      console.error(`Error creating regex for keyword "${keyword}":`, error)
    }
  }

  // Check for comment style matches
  if (language.comments) {
    let hasCommentStyleMatch = false

    if (language.comments.line) {
      for (const lineComment of language.comments.line) {
        if (code.includes(lineComment)) {
          hasCommentStyleMatch = true
          break
        }
      }
    }

    if (!hasCommentStyleMatch && language.comments.block) {
      for (const blockComment of language.comments.block) {
        if (code.includes(blockComment.start) && code.includes(blockComment.end)) {
          hasCommentStyleMatch = true
          break
        }
      }
    }

    if (hasCommentStyleMatch) {
      score += 2
      matchDetails.commentStyleMatch = true
    }
  }

  // Apply language-specific heuristics
  switch (language.name) {
    case "html":
      if (features.hasDoctypeHtml) {
        score += 10
        matchDetails.featureMatches.hasDoctypeHtml = true
      }
      if (features.brackets.angle > features.brackets.curly * 2) {
        score += 5
        matchDetails.featureMatches.moreAngleBrackets = true
      }
      break

    case "javascript":
    case "typescript":
      if (features.semicolons > 0 && features.brackets.curly > 0) {
        score += 2
        matchDetails.featureMatches.hasSemicolonsAndCurlyBraces = true
      }
      break

    case "python":
      if (features.indentation.spaces > 0 && features.brackets.curly === 0) {
        score += 5
        matchDetails.featureMatches.usesSpacesNoCurlyBraces = true
      }
      break

    case "ruby":
      if (code.includes("end") && features.brackets.curly === 0) {
        score += 3
        matchDetails.featureMatches.usesEndKeywordNoCurlyBraces = true
      }
      break

    case "bash":
      if (features.hasShebang) {
        score += 10
        matchDetails.featureMatches.hasShebang = true
      }
      break

    case "json":
      if (
        features.brackets.curly > 0 &&
        features.brackets.square > 0 &&
        code.trim().startsWith("{") &&
        code.trim().endsWith("}")
      ) {
        score += 5
        matchDetails.featureMatches.validJsonStructure = true
      }
      break

    case "yaml":
      if (
        features.indentation.spaces > 0 &&
        features.brackets.curly === 0 &&
        features.brackets.square === 0 &&
        code.includes(":")
      ) {
        score += 5
        matchDetails.featureMatches.yamlStructure = true
      }
      break
  }

  // Normalize score based on code length to avoid bias towards longer snippets
  const codeLength = code.length
  if (codeLength > 0) {
    // Apply a logarithmic normalization to prevent very long files from dominating
    score = score / Math.log10(codeLength + 10)
  }

  return { score, matchDetails }
}

/**
 * Handle edge cases and mixed language content
 */
function handleEdgeCases(
  code: string,
  scores: Record<string, number>,
  matchDetails: Record<string, any>,
): { adjustedScores: Record<string, number>; primaryLanguage: string; secondaryLanguage: string | null } {
  const adjustedScores = { ...scores }

  // Sort languages by score
  const sortedLanguages = Object.entries(scores).sort((a, b) => b[1] - a[1])

  const primaryLanguage = sortedLanguages[0]?.[0] || "plaintext"
  let secondaryLanguage: string | null = sortedLanguages[1]?.[0] || null

  // Handle HTML with embedded JavaScript/CSS
  if (primaryLanguage === "html") {
    if (code.includes("<script") && (scores.javascript || 0) > 0) {
      adjustedScores.javascript = (adjustedScores.javascript || 0) * 1.2
      secondaryLanguage = "javascript"
    }
    if (code.includes("<style") && (scores.css || 0) > 0) {
      adjustedScores.css = (adjustedScores.css || 0) * 1.2
      secondaryLanguage = secondaryLanguage || "css"
    }
  }

  // Handle JSX/TSX (React)
  if (
    (primaryLanguage === "javascript" || primaryLanguage === "typescript") &&
    code.includes("import React") &&
    code.match(/<[A-Z]\w+/) &&
    code.match(/<\/[A-Z]\w+>/)
  ) {
    if (primaryLanguage === "javascript") {
      adjustedScores.javascript *= 1.5
    } else {
      adjustedScores.typescript *= 1.5
    }
  }

  // Handle very short snippets
  if (code.length < 50) {
    // For very short snippets, we're less confident
    for (const lang in adjustedScores) {
      adjustedScores[lang] *= 0.7
    }

    // Increase plaintext score for very short snippets
    adjustedScores.plaintext = (adjustedScores.plaintext || 0) + 0.3
  }

  // If the top language has very few matches, be more conservative
  const topDetails = matchDetails[primaryLanguage]
  if (
    topDetails &&
    topDetails.strongMatches.length === 0 &&
    topDetails.mediumMatches.length <= 1 &&
    topDetails.keywordMatches.length <= 2
  ) {
    adjustedScores[primaryLanguage] *= 0.8
    adjustedScores.plaintext = (adjustedScores.plaintext || 0) + 0.2
  }

  return {
    adjustedScores,
    primaryLanguage: Object.entries(adjustedScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "plaintext",
    secondaryLanguage,
  }
}

/**
 * Main function to detect the programming language from code content
 */
export function detectLanguage(
  content: string,
  filename?: string,
): {
  language: string
  confidence: number
  secondaryLanguage: string | null
  confidenceLevel: "high" | "medium" | "low" | "minimum"
} {
  if (!content || content.trim().length === 0) {
    return {
      language: "plaintext",
      confidence: 1,
      secondaryLanguage: null,
      confidenceLevel: "high",
    }
  }

  // First try to detect from filename if provided
  if (filename) {
    const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase()
    for (const lang of LANGUAGE_DEFINITIONS) {
      if (lang.extensions.includes(extension)) {
        // Still analyze the content to confirm
        const tokens = tokenizeCode(content)
        const features = extractFeatures(content)
        const { score } = calculateLanguageScore(content, lang, tokens, features)

        // If the score is reasonable, return the language from the extension
        if (score > CONFIDENCE_THRESHOLDS.MEDIUM) {
          return {
            language: lang.name,
            confidence: 0.9,
            secondaryLanguage: null,
            confidenceLevel: "high",
          }
        }
      }
    }
  }

  // Tokenize the code
  const tokens = tokenizeCode(content)

  // Extract features
  const features = extractFeatures(content)

  // Calculate scores for each language
  const scores: Record<string, number> = {}
  const allMatchDetails: Record<string, any> = {}

  for (const lang of LANGUAGE_DEFINITIONS) {
    const { score, matchDetails } = calculateLanguageScore(content, lang, tokens, features)
    scores[lang.name] = score
    allMatchDetails[lang.name] = matchDetails
  }

  // Handle edge cases and mixed language content
  const { adjustedScores, primaryLanguage, secondaryLanguage } = handleEdgeCases(content, scores, allMatchDetails)

  // Calculate confidence level
  const topScore = adjustedScores[primaryLanguage] || 0
  const runnerUpScore = secondaryLanguage ? adjustedScores[secondaryLanguage] || 0 : 0

  // Calculate confidence as the difference between top and runner-up scores
  const confidence = Math.min(1, Math.max(0, topScore - runnerUpScore))

  // Determine confidence level
  let confidenceLevel: "high" | "medium" | "low" | "minimum"
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    confidenceLevel = "high"
  } else if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    confidenceLevel = "medium"
  } else if (confidence >= CONFIDENCE_THRESHOLDS.LOW) {
    confidenceLevel = "low"
  } else {
    confidenceLevel = "minimum"

    // If confidence is very low, default to plaintext
    if (confidence < CONFIDENCE_THRESHOLDS.MINIMUM) {
      return {
        language: "plaintext",
        confidence: 0.5,
        secondaryLanguage: primaryLanguage !== "plaintext" ? primaryLanguage : null,
        confidenceLevel: "medium",
      }
    }
  }

  return {
    language: primaryLanguage,
    confidence,
    secondaryLanguage,
    confidenceLevel,
  }
}
