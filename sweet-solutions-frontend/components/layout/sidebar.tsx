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
  const [isHovered, setIsHovered] = useState(false)
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

  // Determine if sidebar should appear expanded (for hover state)
  const isExpanded = isHovered && isCollapsed && !isMobile

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen shadow-lg group",
          isExpanded ? "w-[200px]" : isCollapsed ? "w-[72px]" : "w-[200px]",
          isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
        style={{ 
          background: 'linear-gradient(to bottom, #D9F4F1, #BEE8E0)', 
          boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.05)',
          transition: 'var(--sidebar-transition)'
        }}
      >
        <div className="flex h-full flex-col">
        {/* Logo Icon at Top - Always visible, centered when collapsed */}
        <div 
          className="flex items-center justify-center border-b border-[var(--border)]"
          style={{ 
            height: '49px', // Match nav item height with py-2.5 (20px padding + icon height + gap)
            transition: 'var(--sidebar-transition)'
          }}
        >
          <img 
            src="/howdyslogo.png" 
            alt="Howdy Homemade Logo" 
            className="object-contain flex-shrink-0 transition-all duration-150 ease-out hover:scale-[1.03] hover:brightness-110"
            style={{
              height: isCollapsed && !isExpanded ? '20px' : '28px',
              width: isCollapsed && !isExpanded ? '20px' : '28px',
              transform: isCollapsed && !isExpanded ? 'scale(0.8)' : 'scale(1)'
            }}
          />
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none group/item transition-all duration-200 ease-out",
                  isActive
                    ? "bg-[var(--brandBlue)] text-white shadow-md hover:bg-[color:rgba(59,175,218,.95)]"
                    : "text-[color:rgba(44,42,41,.7)] hover:bg-[color:rgba(59,175,218,.08)] hover:text-[var(--text)]",
                  isCollapsed && !isExpanded ? "justify-center" : "gap-3"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-150 ease-out",
                  isActive ? "text-white" : "text-[color:rgba(44,42,41,.6)]",
                  "group-hover/item:scale-105"
                )} />
                {/* Show label if expanded or on hover */}
                <span 
                  className={cn(
                    "truncate whitespace-nowrap overflow-hidden transition-opacity duration-300",
                    isExpanded || !isCollapsed ? "opacity-100" : "opacity-0"
                  )}
                  style={{ 
                    transitionDelay: isExpanded || !isCollapsed ? '0.1s' : '0s'
                  }}
                >
                  {item.name}
                </span>
                {/* Tooltip when collapsed and not hovered */}
                {isCollapsed && !isExpanded && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#2C2A29] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-all duration-150 ease-out whitespace-nowrap z-50 shadow-lg transform translate-x-[-4px] group-hover/item:translate-x-0">
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
