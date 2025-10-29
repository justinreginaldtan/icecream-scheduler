"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ThemeSwitcherProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const flavorOptions = [
  {
    value: "classic-cream",
    label: "Classic Cream",
    accent: "#F0634A",
  },
  {
    value: "vanilla-mint",
    label: "Vanilla × Mint",
    accent: "#5CBF92",
  },
  {
    value: "strawberry-cream",
    label: "Strawberry Cream",
    accent: "#F46B63",
  },
  {
    value: "honey-latte",
    label: "Honey Latte",
    accent: "#C46A2F",
  },
  {
    value: "lavender-milk",
    label: "Lavender Milk",
    accent: "#A18BFF",
  },
] as const

export function ThemeSwitcher({ open, onOpenChange }: ThemeSwitcherProps) {
  const [selectedTheme, setSelectedTheme] = useState("classic-cream")

  useEffect(() => {
    // Flavor theme system
    if (typeof window === "undefined") return
    const storedTheme = window.localStorage.getItem("sweetSolutionsTheme")
    const initialTheme = storedTheme || document.documentElement.dataset.theme || "classic-cream"
    setSelectedTheme(initialTheme)
  }, [])

  useEffect(() => {
    // Flavor theme system
    if (!open) return
    if (typeof document === "undefined") return
    const currentTheme = document.documentElement.dataset.theme || "classic-cream"
    setSelectedTheme(currentTheme)
  }, [open])

  const handleSelect = (theme: (typeof flavorOptions)[number]["value"]) => {
    // Flavor theme system
    if (typeof window === "undefined") return
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("sweetSolutionsTheme", theme)
    setSelectedTheme(theme)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px] rounded-3xl border border-[var(--border-subtle)] bg-white/80 p-6 shadow-xl backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-[var(--foreground)]">
            🍦 Choose Your Flavor
          </DialogTitle>
        </DialogHeader>
        <div className="mt-3 flex flex-col gap-3">
          {flavorOptions.map((flavor) => {
            const isActive = selectedTheme === flavor.value
            return (
              <motion.button
                key={flavor.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(flavor.value)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                  "bg-white/70 shadow-sm backdrop-blur-sm",
                  isActive
                    ? "border-[var(--accent-primary)] shadow-md"
                    : "border-[var(--border-subtle)] hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-8 w-8 rounded-full border border-white shadow-inner"
                    style={{ background: flavor.accent }}
                  />
                  <span className="text-sm font-medium text-[var(--body-text)]">{flavor.label}</span>
                </div>
                {isActive && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-primary)]">
                    Active
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
