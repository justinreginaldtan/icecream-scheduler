export interface Theme {
  name: string
  sidebarBackground: string
  headerBackground: string
  mainBackground: string
  cardBackground: string
  cardBorder: string
  shadow: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  accentPrimary: string
  accentSecondary: string
  buttonStyle: {
    background: string
    color: string
    borderRadius: string
  }
}

export const playfulLocalTheme: Theme = {
  name: "Howdy Homemade: Sweet Solutions",
  sidebarBackground: "#E8F4F1",
  headerBackground: "rgba(255, 253, 252, 0.9)",
  mainBackground: "linear-gradient(to bottom, #FFFDFC 0%, #FFF5EC 20%)",
  cardBackground: "#FFFFFF",
  cardBorder: "1px solid rgba(0, 0, 0, 0.04)",
  shadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
  textPrimary: "#4E463E",
  textSecondary: "#6A635D",
  textTertiary: "#9D948D",
  accentPrimary: "#C46A2F",
  accentSecondary: "#44B09C",
  buttonStyle: {
    background: "linear-gradient(135deg, #C46A2F 0%, #A45328 100%)",
    color: "#FFFFFF",
    borderRadius: "14px",
  },
}

export const modernBoutiqueTheme: Theme = {
  name: "Howdy Homemade: Sweet Solutions",
  sidebarBackground: "#E8F4F1",
  headerBackground: "rgba(255, 253, 252, 0.9)",
  mainBackground: "linear-gradient(to bottom, #FFFDFC 0%, #FFF5EC 20%)",
  cardBackground: "#FFFFFF",
  cardBorder: "1px solid rgba(0, 0, 0, 0.08)",
  shadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
  textPrimary: "#4E463E",
  textSecondary: "#6A635D",
  textTertiary: "#9D948D",
  accentPrimary: "#C46A2F",
  accentSecondary: "#44B09C",
  buttonStyle: {
    background: "linear-gradient(135deg, #C46A2F 0%, #A45328 100%)",
    color: "#FFFFFF",
    borderRadius: "14px",
  },
}

export type ThemeName = "playful" | "modern"

export const themes: Record<ThemeName, Theme> = {
  playful: playfulLocalTheme,
  modern: modernBoutiqueTheme,
}
