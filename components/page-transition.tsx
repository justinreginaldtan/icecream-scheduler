"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={cn(
        "transition-all duration-[250ms] ease-out",
        isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}
    >
      {children}
    </div>
  )
}

