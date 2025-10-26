"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Users, DollarSign, FileText, Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["manager", "employee"], section: "Overview" },
  { name: "Schedule", href: "/schedule", icon: Calendar, roles: ["manager", "employee"], section: "Team" },
  { name: "Employees", href: "/employees", icon: Users, roles: ["manager", "employee"], section: "Team" },
  { name: "Requests", href: "/requests", icon: FileText, roles: ["manager", "employee"], section: "Team" },
  { name: "Payroll", href: "/payroll", icon: DollarSign, roles: ["manager"], section: "Finance" },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["manager"], section: "System" },
]

export function Sidebar({ onCollapseChange }: { onCollapseChange?: (collapsed: boolean) => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const handleToggle = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapseChange?.(newCollapsed)
  }

  const visibleNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  const sections = visibleNavigation.reduce(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = []
      }
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, typeof navigation>,
  )

  return (
    <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-[#8BD9D6] bg-gradient-to-b from-[#A0E7E5] to-[#B9F3F2] sidebar-transition shadow-xl",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-[#8BD9D6]/50 px-4">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-white drop-shadow-sm">Sweet Solutions</h1>
            )}
            <button
              onClick={handleToggle}
              className="rounded-2xl p-3 bg-white/20 hover:bg-white/30 hover:shadow-lg hover:shadow-[#A0E7E5]/50 transition-all duration-300 hover:scale-110 wiggle group"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-7 w-7 text-white group-hover:text-[#FFEE93] transition-colors" />
            </button>
          </div>

          <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto">
            {Object.entries(sections).map(([sectionName, items]) => (
              <div key={sectionName}>
                {!isCollapsed && (
                  <div className="px-3 mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      {sectionName}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-white/40 text-white shadow-lg hover:bg-white/50 hover:shadow-xl hover:scale-[1.02]"
                            : "text-white/80 hover:text-white hover:bg-white/20 hover:shadow-md",
                        )}
                        data-testid={`nav-${item.name.toLowerCase()}`}
                        title={isCollapsed ? item.name : undefined}
                      >
                        {/* Active scoop indicator */}
                        {isActive && (
                          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFB7B2] shadow-sm" />
                        )}
                        
                        <item.icon 
                          className={cn(
                            "h-6 w-6 rounded-xl p-1.5 transition-all duration-200",
                            isActive
                              ? "bg-[#FFB7B2]/20 text-white shadow-md"
                              : "text-white/70 group-hover:text-white group-hover:bg-white/10 group-hover:shadow-sm"
                          )} 
                        />
                        
                        {!isCollapsed && <span className="flex-1">{item.name}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/30 p-4 pt-3">
            {!isCollapsed && (
              <p className="text-xs font-semibold bg-gradient-to-r from-[#FFB7B2] to-[#FFEE93] bg-clip-text text-transparent">
                Sweet Solutions
              </p>
            )}
          </div>
        </div>
      </aside>
  )
}
