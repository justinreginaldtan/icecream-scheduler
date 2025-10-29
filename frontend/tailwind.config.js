/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Enhanced 8pt spacing system
      spacing: {
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
        26: "6.5rem", // 104px
        30: "7.5rem", // 120px
        34: "8.5rem", // 136px
        38: "9.5rem", // 152px
        42: "10.5rem", // 168px
        46: "11.5rem", // 184px
        50: "12.5rem", // 200px
        54: "13.5rem", // 216px
        58: "14.5rem", // 232px
        62: "15.5rem", // 248px
        66: "16.5rem", // 264px
        70: "17.5rem", // 280px
        74: "18.5rem", // 296px
        78: "19.5rem", // 312px
        82: "20.5rem", // 328px
        86: "21.5rem", // 344px
        90: "22.5rem", // 360px
        94: "23.5rem", // 376px
        98: "24.5rem", // 392px
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Sweet Solutions brand colors
        brandBlue: "var(--brandBlue)",
        brandPink: "var(--brandPink)",
        howdyBlue: "#3BAFDA",
        howdyPink: "#F9A5B8",
        // Premium colors - Phase 2
        vanillaWarm: "#FBE5CF",
        vanillaLight: "#FFF6EF",
        coralPrimary: "#F86E5A",
        coralBright: "#FF8B6E",
        mintFresh: "#CDEDE5",
        mintLight: "#A0E7E5",
        cocoaText: "#2C2015",
        cocoaSoft: "#5C4C3F",
        peachTint: "#FFE9D1",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Poppins", "Nunito Sans", "system-ui", "sans-serif"],
        heading: ["Fredoka", "Baloo 2", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
        nunito: ["Nunito Sans", "system-ui", "sans-serif"],
        fredoka: ["Fredoka", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.04), 0 10px 22px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 18px rgba(0,0,0,0.08), 0 14px 28px rgba(255, 180, 130, 0.18)",
        button: "0 4px 12px rgba(248,110,90,0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
