"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { BarChart3, FileCode, MessageSquare, PieChart, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: PieChart,
  },
  {
    name: "Snippets",
    href: "/admin/snippets",
    icon: FileCode,
  },
  {
    name: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="border-gray-200 bg-white">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-gray-100 px-6">
            <Logo />
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-emerald-500" : "text-gray-400"}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t border-gray-100 p-4">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 text-gray-400" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
