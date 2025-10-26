"use client"

import type React from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useSidebar } from "@/lib/sidebar-context"
import { useState, useEffect } from "react"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  const { isCollapsed } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

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
      <div 
        className="flex flex-1 flex-col"
        style={{
          paddingLeft: isMobile ? '0' : isCollapsed ? '72px' : '200px',
          transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
