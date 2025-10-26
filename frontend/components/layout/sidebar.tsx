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
          background: 'var(--sidebar-bg)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'var(--card-glass-blur)',
          WebkitBackdropFilter: 'var(--card-glass-blur)',
          transition: 'all var(--transition-slow) var(--ease-out-cubic)'
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Branding - Clickable Toggle */}
          <div className="px-4 pt-6 pb-6" style={{ 
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
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
                <div>
                  <h1 className="text-lg font-semibold text-[var(--brandBlue)] leading-tight">Howdy Homemade</h1>
                  <p className="text-xs font-medium text-[var(--brandPink)] leading-tight">Sweet Solutions</p>
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
                  "sidebar-nav-link relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none group/item cursor-pointer transition-all duration-200 ease-out",
                  isCollapsed ? "justify-center px-2" : "gap-3",
                  isActive && "sidebar-nav-link-active"
                )}
                style={{
                  animation: `fadeInUp 0.4s ease forwards`,
                  animationDelay: `${index * 0.06}s`
                }}
                data-active={isActive}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200 ease-out",
                  "group-hover/item:-translate-y-[2px]",
                  isActive ? "text-[var(--primary)]" : "text-[color:rgba(76,89,86,0.7)]"
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
                  "sidebar-nav-link relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none group/item cursor-pointer transition-all duration-200 ease-out",
                  isCollapsed ? "justify-center px-2" : "gap-3",
                  isActive && "sidebar-nav-link-active"
                )}
                data-active={isActive}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200 ease-out",
                  "group-hover/item:-translate-y-[2px]",
                  isActive ? "text-[var(--primary)]" : "text-[color:rgba(76,89,86,0.7)]"
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
          </nav>

        </div>
      </aside>
    </>
  )
}
