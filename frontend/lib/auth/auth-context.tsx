"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import apiClient from "@/lib/api/client"

export type UserRole = "manager" | "employee"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const normalizeUser = (rawUser: any): User | null => {
    if (!rawUser) return null
    const role: UserRole = rawUser.role === "manager" ? "manager" : "employee"

    return {
      id: rawUser.id?.toString?.() ?? "",
      email: rawUser.email ?? "",
      name: rawUser.name ?? rawUser.email ?? "User",
      role,
      lastLogin: rawUser.lastLogin,
    }
  }

  const defaultPathForRole = (role: UserRole | undefined) =>
    role === "manager" ? "/" : "/employee"

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("sweet-solutions-user")
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          setUser(normalizeUser(parsed))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
        localStorage.removeItem("sweet-solutions-user")
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/login", "/unauthorized"]
    const pathIsPublic = publicPaths.includes(pathname)

    if (!user && !pathIsPublic) {
      router.push("/login")
    }

    if (user && pathIsPublic) {
      router.push(defaultPathForRole(user.role))
    }
  }, [user, pathname, router, isLoading])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await apiClient.login(email, password)
      if (response.success && response.data?.user) {
        const normalizedUser = normalizeUser(response.data.user)
        if (!normalizedUser) return null

        setUser(normalizedUser)
        localStorage.setItem("sweet-solutions-user", JSON.stringify(normalizedUser))
        localStorage.setItem("auth-token", response.data.token || "")
        return normalizedUser
      }
      return null
    } catch (error) {
      console.error("Login failed:", error)
      return null
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
    localStorage.removeItem("sweet-solutions-user")
    apiClient.logout().catch(console.error)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
