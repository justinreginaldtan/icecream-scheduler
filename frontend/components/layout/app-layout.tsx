"use client"

import type React from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Sidebar } from "./sidebar"
import { useSidebar } from "@/lib/sidebar-context"
import { useState, useEffect } from "react"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  const { isCollapsed } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Flavor theme system
    if (typeof window === "undefined") return
    const storedTheme = window.localStorage.getItem("sweetSolutionsTheme")
    const initialTheme = storedTheme || "classic-cream"
    document.documentElement.dataset.theme = initialTheme
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-[color:rgba(44,42,41,.6)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main
        className="flex flex-1 flex-col"
        style={{
          marginLeft: isMobile ? "0" : isCollapsed ? "72px" : "200px",
          transition: "margin-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          padding: "2.75rem",
        }}
      >
        {children}
      </main>
    </div>
  )
}
