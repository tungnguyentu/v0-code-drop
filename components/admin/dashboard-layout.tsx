import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
