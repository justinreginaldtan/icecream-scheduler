"use client"

import type React from "react"
import { useState } from "react"

import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { PageTransition } from "./page-transition"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar onCollapseChange={setIsCollapsed} />
      <div 
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '5rem' : '16rem' }}
      >
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
