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
  name: "Howdy Homemade: Sweet Solutions",
  sidebarBackground: "linear-gradient(180deg, #DCF3EE 0%, #BFE8DE 100%)",
  headerBackground: "rgba(255, 255, 255, 0.95)",
  mainBackground: "linear-gradient(180deg, #FAF8F2 0%, #F5F2EA 100%)",
  cardBackground: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 254, 248, 0.85) 100%)",
  cardBorder: "1px solid rgba(255, 255, 255, 0.3)",
  shadow: "0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
  textPrimary: "#2E2E2E",
  accentPrimary: "#E25744",
  accentSecondary: "#44B09C",
  buttonStyle: {
    background: "linear-gradient(180deg, #E25744 0%, #C84935 100%)",
    color: "white",
    borderRadius: "12px",
  },
}

export const modernBoutiqueTheme: Theme = {
  name: "Howdy Homemade: Sweet Solutions",
  sidebarBackground: "linear-gradient(180deg, #DCF3EE 0%, #BFE8DE 100%)",
  headerBackground: "rgba(255, 255, 255, 0.95)",
  mainBackground: "linear-gradient(180deg, #FAF8F2 0%, #F5F2EA 100%)",
  cardBackground: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 254, 248, 0.85) 100%)",
  cardBorder: "1px solid rgba(255, 255, 255, 0.3)",
  shadow: "0 16px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06)",
  textPrimary: "#2E2E2E",
  accentPrimary: "#E25744",
  accentSecondary: "#44B09C",
  buttonStyle: {
    background: "linear-gradient(180deg, #E25744 0%, #C84935 100%)",
    color: "white",
    borderRadius: "12px",
  },
}

export type ThemeName = "playful" | "modern"

export const themes: Record<ThemeName, Theme> = {
  playful: playfulLocalTheme,
  modern: modernBoutiqueTheme,
}
