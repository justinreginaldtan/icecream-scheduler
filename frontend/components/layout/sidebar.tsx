'''"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Users, DollarSign, FileText, Settings, LogOut } from "lucide-react"
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
  const { user, logout } = useAuth()
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
          background: 'var(--sidebar-bg)', 
          boxShadow: 'var(--shadow-sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Branding - Clickable Toggle */}
          <div className="px-4 pt-6 pb-6 border-b border-[var(--border)]">
            <div 
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              role="button"
              className={cn(
                "cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95",
                "flex items-center gap-3 mb-2",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <img 
                src="/howdyslogo.png" 
                alt="Howdy Homemade Logo" 
                className={cn(
                  "object-contain flex-shrink-0 transition-all duration-300",
                  isCollapsed ? "h-7 w-7 rotate-3" : "h-8 w-8 rotate-0"
                )}
                style={{
                  transform: isCollapsed ? 'scale(0.9)' : 'scale(1)'
                }}
              />
              {!isCollapsed && (
                <div className="flex items-center gap-1">
                  <h1 className="text-lg font-semibold text-[var(--sidebar-text-active)] leading-tight">Howdy Homemade</h1>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
            {/* Main nav items */}
            <div className="space-y-2">
              {visibleNavigation.filter(item => item.name !== 'Settings').map((item, index) => {
                const isActive = pathname === item.href
                return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none group/item cursor-pointer",
                  "transition-all duration-200 ease-out",
                  isActive
                    ? "bg-mint-100 text-[var(--sidebar-icon-active)]"
                    : "text-[var(--sidebar-text)] hover:bg-mint-50",
                  isCollapsed ? "justify-center px-2" : "gap-3"
                )}
                style={{
                  animation: `fadeInUp 0.4s ease forwards`,
                  animationDelay: `${index * 0.06}s`,
                  ...(isActive && { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' })
                }}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200 ease-out",
                  "group-hover/item:translate-y-[-2px] group-hover/item:rotate-3",
                  isActive ? "text-[var(--sidebar-icon-active)]" : "text-[var(--sidebar-icon)]"
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
            </div>

            {/* Separator */}
            <div className="my-3 border-t border-[var(--border)]" />

            {/* Settings at bottom */}
            <div className="space-y-2 pb-8">
              {visibleNavigation.filter(item => item.name === 'Settings').map((item) => {
                const isActive = pathname === item.href
                return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none group/item cursor-pointer",
                  "transition-all duration-200 ease-out",
                  isActive
                    ? "bg-mint-100 text-[var(--sidebar-icon-active)]"
                    : "text-[var(--sidebar-text)] hover:bg-mint-50",
                  isCollapsed ? "justify-center px-2" : "gap-3"
                )}
                style={{
                  ...(isActive && { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' })
                }}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200 ease-out",
                  "group-hover/item:translate-y-[-2px] group-hover/item:rotate-3",
                  isActive ? "text-[var(--sidebar-icon-active)]" : "text-[var(--sidebar-icon)]"
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
            </div>

            {/* Logout Button */}
            <div className="mt-auto">
              <button
                onClick={logout}
                className={cn(
                  "relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none group/item cursor-pointer w-full",
                  "transition-all duration-200 ease-out",
                  "text-[var(--sidebar-text)] hover:bg-mint-50",
                  isCollapsed ? "justify-center px-2" : "gap-3"
                )}
                data-testid="logout-button"
              >
                <LogOut className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200 ease-out",
                  "group-hover/item:translate-y-[-2px] group-hover/item:rotate-3",
                  "text-[var(--sidebar-icon)]"
                )} />
                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap transition-opacity duration-300">
                    Logout
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#2C2A29] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-all duration-150 ease whitespace-nowrap z-50 shadow-lg">
                    Logout
                  </div>
                )}
              </button>
            </div>
          </nav>

        </div>
      </aside>
    </>
  )
}
'''