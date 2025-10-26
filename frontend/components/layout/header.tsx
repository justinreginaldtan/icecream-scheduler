"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, User, ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { useSidebar } from "@/lib/sidebar-context"
import { useState, useEffect } from "react"

export function Header() {
  const { user, logout } = useAuth()
  const { toggleSidebar, isCollapsed } = useSidebar()
  const [showToggle, setShowToggle] = useState(false)

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  useEffect(() => {
    const handleResize = () => {
      setShowToggle(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header 
      role="banner" 
      data-testid="global-header" 
      className="sticky top-0 z-30 flex h-16 items-center justify-between" 
      style={{ 
        borderTop: '3px solid var(--berry-500)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        paddingLeft: '24px', 
        paddingRight: '24px' 
      }}
    >
      {/* Left: Toggle + Logo/Brand */}
      <div className="flex items-center gap-4">
        {showToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <img 
            src="/howdyslogo.png" 
            alt="Howdy Homemade Logo" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-semibold text-[var(--brandBlue)]">Howdy Homemade</h1>
            <p className="text-xs font-medium text-[var(--brandPink)]">Sweet Solutions</p>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Date Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm font-medium text-[color:rgba(44,42,41,.7)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
            >
              This Week
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>This Week</DropdownMenuItem>
            <DropdownMenuItem>Last Week</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
            <DropdownMenuItem>Last Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
        >
          <Bell className="h-5 w-5 text-[color:rgba(44,42,41,.7)]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brandPink)]" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-[var(--brandBlue)] text-white text-sm">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
