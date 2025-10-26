/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
        '54': '13.5rem',  // 216px
        '58': '14.5rem',  // 232px
        '62': '15.5rem',  // 248px
        '66': '16.5rem',  // 264px
        '70': '17.5rem',  // 280px
        '74': '18.5rem',  // 296px
        '78': '19.5rem',  // 312px
        '82': '20.5rem',  // 328px
        '86': '21.5rem',  // 344px
        '90': '22.5rem',  // 360px
        '94': '23.5rem',  // 376px
        '98': '24.5rem',  // 392px
      },
      colors: {
        border: "var(--border-subtle)",
        input: "var(--surface-2)",
        ring: "var(--focus-ring)",
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
        accent: {
          DEFAULT: "var(--accent-berry)",
          foreground: "var(--charcoal-900)",
        },
        muted: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--body-text-muted)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--foreground)",
        },
        popover: {
          DEFAULT: "var(--floating-bg)",
          foreground: "var(--foreground)",
        },
        vanilla: {
          50: "var(--vanilla-50)",
          100: "var(--vanilla-100)",
          200: "var(--vanilla-200)",
          300: "var(--vanilla-300)",
        },
        cocoa: {
          600: "var(--charcoal-600)",
          700: "var(--charcoal-700)",
          800: "var(--charcoal-800)",
          900: "var(--charcoal-900)",
        },
        caramel: {
          400: "var(--caramel-400)",
          500: "var(--caramel-500)",
          600: "var(--caramel-600)",
        },
        strawberry: {
          400: "var(--strawberry-400)",
          500: "var(--strawberry-500)",
          600: "var(--strawberry-600)",
        },
        pistachio: {
          400: "var(--pistachio-400)",
          500: "var(--pistachio-500)",
        },
        sky: {
          400: "var(--sky-400)",
          500: "var(--sky-500)",
        },
        info: {
          DEFAULT: "var(--info-500)",
          foreground: "#0d2f4a",
        },
        success: {
          DEFAULT: "var(--success-500)",
          foreground: "#1f3b2d",
        },
        warning: {
          DEFAULT: "var(--warning-500)",
          foreground: "#3b240a",
        },
        destructive: {
          DEFAULT: "var(--error-500)",
          foreground: "#fffaf6",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'var(--font-body)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-lora)', 'Lora', 'Georgia', 'serif'],
        serif: ['var(--font-lora)', 'Lora', 'Georgia', 'serif'],
        heading: ['var(--font-lora)', 'Lora', 'Georgia', 'serif'],
        poppins: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
        '4xl': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em' }],
        '5xl': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }],
        '6xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        '7xl': ['3.5rem', { lineHeight: '3.75rem', letterSpacing: '-0.03em' }],
        '8xl': ['4rem', { lineHeight: '4.25rem', letterSpacing: '-0.03em' }],
        '9xl': ['4.75rem', { lineHeight: '5rem', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        card: 'var(--elevation-surface-1dp)',
        'card-hover': 'var(--elevation-surface-4dp)',
        'card-active': 'var(--elevation-surface-8dp)',
        button: 'var(--primary-shadow)',
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
