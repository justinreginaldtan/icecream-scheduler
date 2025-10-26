// Sweet Solutions Ice Cream Shop Theme - Phase 2 Premium Edition
export const theme = {
  colors: {
    // Premium Gradient Background
    bg: "linear-gradient(to bottom, #FBE5CF 0%, #FFF6EF 100%)",
    bgVanillaWarm: "#FBE5CF",
    bgVanillaLight: "#FFF6EF",
    bgOverlay: "linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0))",
    
    // Core Surfaces
    surface: "#FFFFFF",
    cardGradient: "linear-gradient(to bottom right, #FFFFFF, #FFF6F0)",
    
    // Typography - Phase 2 Enhanced
    text: "#2C2015", // Rich cocoa for headings
    bodyText: "#5C4C3F", // Softer cocoa for body
    textSecondary: "#666666",
    
    // Borders & Subtle Elements
    border: "rgba(0,0,0,0.06)",
    
    // Primary Brand - Coral Warmth
    primary: "#F86E5A",
    primaryBright: "#FF8B6E",
    primaryGradient: "linear-gradient(to bottom right, #F86E5A, #FF8B6E)",
    
    // Sidebar - Mint-Peach Harmony
    sidebar: "linear-gradient(to bottom, #CDEDE5 0%, #E6F5F0 100%)",
    sidebarText: "#2C2015",
    mintLight: "#A0E7E5",
    peachTint: "#FFE9D1",
    
    // Ice Cream Flavors
    strawberry: "#FFB7B2",
    mint: "#CDEDE5",
    vanilla: "#FFEE93",
    
    // Muted & Subtle
    muted: "#FFF6EF",
    
    // Premium Shadows - Phase 2 Enhanced with 6px blur
    shadow: {
      sm: "0 1px 2px rgba(0,0,0,0.02)",
      md: "0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)",
      lg: "0 10px 20px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05)",
      xl: "0 20px 32px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06)",
      card: "0 2px 6px rgba(0,0,0,0.03), 0 10px 24px rgba(0,0,0,0.06)",
      cardHover: "0 4px 12px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.08)",
      button: "0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(248,110,90,0.3)",
      buttonHover: "0 3px 10px rgba(0,0,0,0.12), 0 6px 16px rgba(248,110,90,0.35)",
    },
  },
}

export type RoleColor = "strawberry" | "mint" | "vanilla"
