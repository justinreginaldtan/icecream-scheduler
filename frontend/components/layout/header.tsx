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
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const { user, logout } = useAuth()
  const { toggleSidebar, isCollapsed } = useSidebar()
  const [showToggle, setShowToggle] = useState(false)
  const [selectedRange, setSelectedRange] = useState("This Week")
  const { toast } = useToast()

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
    <header role="banner" data-testid="global-header" className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] shadow-sm" style={{ borderTop: '3px solid #F46C5B', paddingLeft: '24px', paddingRight: '24px' }}>
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
              {selectedRange}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {["This Week", "Last Week", "This Month", "Last Month"].map((label) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => {
                  setSelectedRange(label)
                  toast({
                    title: "Date range updated",
                    description: `Now showing ${label.toLowerCase()}.`,
                    className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
                  })
                }}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
          onClick={() =>
            toast({
              title: "Notifications",
              description: "You're all caught up! 🎉",
              className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
            })
          }
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
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() =>
                toast({
                  title: "Profile coming soon",
                  description: "Profile editing will be available in the next release.",
                  className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
                })
              }
            >
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
