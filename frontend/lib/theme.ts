export interface Theme {
  name: string
  sidebarBackground: string
  headerBackground: string
  mainBackground: string
  cardBackground: string
  cardBorder: string
  shadow: string
  textPrimary: string
  accentPrimary: string
  accentSecondary: string
  buttonStyle: {
    background: string
    color: string
    borderRadius: string
  }
}

export const playfulLocalTheme: Theme = {
  name: "Sweet Solutions Premium",
  sidebarBackground: "linear-gradient(135deg, #C0E6E3 0%, #D8F0ED 50%, #E8F5F2 100%)",
  headerBackground: "white",
  mainBackground: "linear-gradient(to bottom, #F8DAB5 0%, #FFF5EA 50%, #FFF8F0 100%)",
  cardBackground: "linear-gradient(135deg, #FEFCF9 0%, #FFF9F3 50%, #FFF6F0 100%)",
  cardBorder: "none",
  shadow: "0 2px 8px rgba(200,180,160,0.08), 0 12px 28px rgba(150,140,120,0.08)",
  textPrimary: "#3C2F28",
  accentPrimary: "#F86E5A",
  accentSecondary: "#FF8B6E",
  buttonStyle: {
    background: "linear-gradient(to bottom right, #F86E5A, #FF8B6E)",
    color: "white",
    borderRadius: "16px",
  },
}

export const modernBoutiqueTheme: Theme = {
  name: "Modern Boutique Ice Cream",
  sidebarBackground: "linear-gradient(135deg, #C0E6E3 0%, #D8F0ED 50%, #E8F5F2 100%)",
  headerBackground: "white",
  mainBackground: "linear-gradient(to bottom, #F8DAB5 0%, #FFF5EA 50%, #FFF8F0 100%)",
  cardBackground: "linear-gradient(135deg, #FEFCF9 0%, #FFF9F3 50%, #FFF6F0 100%)",
  cardBorder: "none",
  shadow: "0 4px 16px rgba(200,180,160,0.12), 0 20px 40px rgba(180,160,140,0.12)",
  textPrimary: "#3C2F28",
  accentPrimary: "#F86E5A",
  accentSecondary: "#FF8B6E",
  buttonStyle: {
    background: "linear-gradient(to bottom right, #F86E5A, #FF8B6E)",
    color: "white",
    borderRadius: "16px",
  },
}

export type ThemeName = "playful" | "modern"

export const themes: Record<ThemeName, Theme> = {
  playful: playfulLocalTheme,
  modern: modernBoutiqueTheme,
}
