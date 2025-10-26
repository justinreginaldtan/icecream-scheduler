"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Users, DollarSign, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { useNav } from "@/lib/utils/navigation"
import { useSidebar } from "@/lib/sidebar-context"
import { useState, useEffect, useRef } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["manager", "employee"], section: "Overview" },
  { name: "Schedule", href: "/schedule", icon: Calendar, roles: ["manager", "employee"], section: "Team" },
  { name: "Employees", href: "/employees", icon: Users, roles: ["manager", "employee"], section: "Team" },
  { name: "Requests", href: "/requests", icon: FileText, roles: ["manager", "employee"], section: "Team" },
  { name: "Payroll", href: "/payroll", icon: DollarSign, roles: ["manager"], section: "Finance" },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["manager"], section: "System" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const nav = useNav()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  const visibleNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  // Check if mobile viewport and auto-collapse on screens < 1024px
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        !isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, isCollapsed, toggleSidebar])

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen shadow-lg",
          isCollapsed ? "w-[72px]" : "w-[200px]",
          isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
        style={{ 
          background: 'linear-gradient(to bottom, #E0F4F0, #C5ECE3)', 
          boxShadow: 'inset -2px 0 6px rgba(0, 0, 0, 0.05)',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          transition: 'var(--sidebar-transition)'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Navigation Content */}
          <nav className="flex-1 px-2 space-y-1" style={{ paddingTop: '1.25rem' }}>
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none group/item cursor-pointer transition-all duration-150 ease",
                  isActive
                    ? "bg-[#B7E7DF] text-[#1A5F5B]"
                    : "text-[color:rgba(44,42,41,.7)] hover:bg-[color:rgba(183,231,223,.3)]",
                  isCollapsed ? "justify-center px-2" : "gap-3"
                )}
                style={
                  isActive
                    ? { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }
                    : {}
                }
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-150 ease group-hover/item:scale-105",
                  isActive ? "text-[#1A5F5B]" : "text-[color:rgba(44,42,41,.6)]"
                )} />
                {/* Show label if expanded */}
                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#2C2A29] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-all duration-150 ease whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>


      </div>
    </aside>
    </>
  )
}
