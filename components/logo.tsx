import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-300/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Codin
        </span>
        <span className="text-xs text-gray-500 -mt-1">share code, not complexity</span>
      </div>
    </Link>
  )
}
