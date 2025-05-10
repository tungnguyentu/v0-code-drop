import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Skip auth check for login page
  if (typeof window === "undefined" && !children.toString().includes("AdminLoginPage")) {
    const isAdmin = await isAuthenticated()
    if (!isAdmin) {
      redirect("/admin/login")
    }
  }

  return <>{children}</>
}
