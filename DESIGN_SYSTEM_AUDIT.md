# Design System Audit - Howdy Homemade: Sweet Solutions

## 📊 Overview

This document maps all files and variables that define the global theme, colors, and typography system for the Sweet Solutions app.

---

## 🗂️ **Design System Files**

### 1. **`frontend/app/globals.css`**
**Location**: Root design system definitions  
**Primary**: CSS variables for colors, typography, spacing, motion  
**Usage**: Global cascade

### 2. **`frontend/lib/theme.ts`**
**Location**: TypeScript theme interface and legacy themes  
**Primary**: Theme objects for context providers  
**Usage**: React Context

### 3. **`frontend/tailwind.config.js`**
**Location**: Tailwind configuration  
**Primary**: Utility class mappings, extended spacing, fonts  
**Usage**: Tailwind CSS classes

---

## 🎨 **Typography System**

### **Font Families**

#### **File**: `frontend/app/globals.css`
```css
--font-display: "Playfair Display", Georgia, serif
  Purpose: Headlines & hero text
  Import: Google Fonts (400-900 weights)
  
--font-body: "DM Sans", system fonts, sans-serif
  Purpose: UI & body text  
  Import: Google Fonts (400-700 weights)
  
--font-mono: "SF Mono", Monaco, monospace
  Purpose: Code & data
```

#### **File**: `frontend/tailwind.config.js`
```javascript
fontFamily: {
  'sans': ['Poppins', 'Nunito Sans', 'system-ui']  // LEGACY
  'heading': ['Fredoka', 'system-ui']               // LEGACY
}
Note: These appear unused in favor of globals.css vars
```

---

### **Font Sizes & Typography Hierarchy**

#### **File**: `frontend/app/globals.css`

```css
/* Hero Heading (H1) */
h1, .hero-heading
- Font: Playfair Display
- Size: calc(4rem * 1.25) = 80px
- Weight: 900
- Line-height: 1.25
- Color: Charcoal-900 (#2B2B2B)
- Letter-spacing: -0.025em

/* Section Titles (H2) */
h2, .section-title
- Font: Playfair Display
- Size: 2rem (32px)
- Weight: 700
- Line-height: 1.25
- Color: Charcoal-900

/* Subsections (H3) */
h3
- Font: Playfair Display
- Size: 1.5rem (24px)
- Weight: 700
- Line-height: 1.3
- Color: Charcoal-900

/* Body Text */
body, p
- Font: DM Sans
- Size: 1rem (16px)
- Weight: 400
- Line-height: 1.55
- Color: Charcoal-800 (#333333)

/* Small Text */
small, .text-sm
- Font: DM Sans
- Size: 0.875rem (14px)
- Weight: 400
- Line-height: 1.5
- Color: Charcoal-700 (#575757)

/* KPI Numbers */
.kpi-number, .metric-value, [class*="text-3xl"], [class*="text-4xl"]
- Font: DM Sans
- Weight: 900
- Tabular-nums: enabled
- Letter-spacing: 0.03em
- Color: Charcoal-900
- Size Multiplier: 1.15× (text-3xl = 34.5px, text-4xl = 41.4px)

/* Card Labels */
.card-label, .meta-text
- Font: DM Sans
- Size: 0.75rem (12px)
- Weight: 400
- Color: Charcoal-700
- Transform: uppercase
- Letter-spacing: 0.03em

/* Card Descriptions */
.card-subtitle, .description-text
- Font: DM Sans
- Size: 0.875rem (14px)
- Weight: 300
- Color: Charcoal-700
- Letter-spacing: 0.015em
```

#### **File**: `frontend/tailwind.config.js`
```javascript
fontSize: {
  'xs': '0.75rem',    // 12px
  'sm': '0.875rem',   // 14px
  'base': '1rem',     // 16px
  'lg': '1.125rem',   // 18px
  'xl': '1.25rem',    // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  // Plus 5xl-9xl for utility classes
}
```

---

## 🎨 **Color System**

### **Core Palette Colors**

#### **File**: `frontend/app/globals.css`

```css
/* CREAM - Base Surface */
--cream-50: #FDFCF9
--cream-100: #FAF8F2   (Primary background)
--cream-200: #F5F2EA
--cream-300: #EDE8DC
--cream-400: #E0D8C8
--cream-500: #D4C9B5

/* MINT - Fresh Accent */
--mint-50: #EEF9F7
--mint-100: #DCF3EE   (Sidebar gradient start)
--mint-200: #BFE8DE   (Sidebar gradient end)
--mint-300: #96D8C9
--mint-400: #6CC5B0
--mint-500: #44B09C
--mint-600: #369585

/* BERRY - Primary Actions */
--berry-50: #FEF3F1
--berry-100: #FCE7E3
--berry-200: #F8CCC4
--berry-300: #F3A89B
--berry-400: #EB7F6C
--berry-500: #E25744
--berry-600: #C84935
--berry-700: #A13A28

/* CHARCOAL - Text & Contrast (DEEPENED) */
--charcoal-50: #F8F8F8
--charcoal-100: #F0F0F0
--charcoal-200: #DEDEDE
--charcoal-300: #C4C4C4
--charcoal-400: #9E9E9E
--charcoal-500: #757575
--charcoal-600: #6B6B6B   (Warm secondary)
--charcoal-700: #575757   (Neutral depth)
--charcoal-800: #333333   (CONFIDENT primary text)
--charcoal-900: #2B2B2B   (Bold headings)
```

---

### **Semantic Color Applications**

#### **File**: `frontend/app/globals.css`

```css
/* Backgrounds */
--background: #FAF8F2 (Cream-100)
--background-gradient: linear-gradient(180deg, #FAF8F2 0%, #F5F2EA 100%)
--surface-1: rgba(255, 255, 255, 0.95)
--surface-2: rgba(255, 255, 255, 0.98)
--surface-3: rgba(250, 250, 250, 1)

/* Text Hierarchy */
--foreground: var(--charcoal-900)        // #2B2B2B - Headings
--body-text: var(--charcoal-800)         // #333333 - Primary text
--body-text-secondary: var(--charcoal-700)// #575757 - Secondary
--body-text-muted: var(--charcoal-600)   // #6B6B6B - Warm muted

/* Links */
--anchor-color: var(--charcoal-900)
--anchor-hover: var(--berry-600)

/* Primary Actions (Berry) */
--primary: var(--berry-600)              // #C84935
--primary-light: var(--berry-500)       // #E25744
--primary-gradient: linear-gradient(180deg, #E25744 0%, #C84935 100%)
--primary-foreground: #FFFFFF
--primary-shadow: 0 4px 16px rgba(226, 87, 68, 0.3)

/* Secondary Actions (Mint) */
--secondary: var(--mint-600)             // #369585
--secondary-light: var(--mint-500)       // #44B09C
--secondary-gradient: linear-gradient(180deg, #44B09C 0%, #369585 100%)
--secondary-foreground: #FFFFFF

/* Cards */
--card-bg: rgba(255, 255, 255, 0.85)
--card-bg-hover: rgba(255, 255, 255, 0.98)
--card-border: rgba(200, 190, 175, 0.25)
--card-border-hover: rgba(180, 170, 155, 0.35)
--card-gradient: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 254, 248, 0.88) 100%)

/* Sidebar */
--sidebar-bg: linear-gradient(180deg, #DCF3EE 0%, #BFE8DE 100%)
--sidebar-text: var(--charcoal-800)
--sidebar-text-active: var(--charcoal-900)
--sidebar-icon: var(--charcoal-700)
--sidebar-icon-active: var(--berry-600)

/* Borders */
--border-subtle: rgba(115, 115, 115, 0.12)
--border-medium: rgba(90, 85, 80, 0.2)
--border-strong: rgba(70, 65, 60, 0.28)

/* Focus Rings */
--focus-ring: var(--berry-500)
--focus-ring-secondary: var(--mint-500)

/* Legacy Compatibility */
--text: var(--charcoal-800)               // Legacy usage
--brandBlue: var(--mint-500)             // Legacy mint
--brandPink: var(--berry-500)            // Legacy berry
```

---

### **Theme Objects (Legacy)**

#### **File**: `frontend/lib/theme.ts`

```typescript
interface Theme {
  textPrimary: "#2E2E2E"           // Legacy - not actively used
  textSecondary: undefined         // Added to interface
  textTertiary: undefined          // Added to interface
  accentPrimary: "#E25744"         // Berry primary
  accentSecondary: "#44B09C"       // Mint secondary
  // Note: Most UI uses globals.css vars directly
}
```

---

## 📐 **Spacing & Layout**

### **File**: `frontend/app/globals.css`

```css
/* Spacing */
--space-hero-vertical: 4rem (64px)
--space-hero-bottom: 3rem (48px)
--space-kpi-horizontal: 1.5rem (24px)
--space-section: 6rem (96px)

/* Grid */
--grid-margin-desktop: 120px (≥1440px)
--grid-max-width: 1440px

/* Border Radius */
--radius-sm: 10px
--radius-md: 14px
--radius-lg: 20px
--radius-xl: 28px
```

### **File**: `frontend/tailwind.config.js`

```javascript
spacing: {
  '4': '1rem',    // Base unit
  '8': '2rem',
  '16': '4rem',
  '18': '4.5rem', // 72px
  '22': '5.5rem', // 88px
  '26': '6.5rem', // 104px
  '30': '7.5rem', // 120px
  // Extended 8pt system
}
```

---

## 🎯 **Summary**

### **Typography Sources**
- **Primary**: `globals.css` (CSS variables)
- **Secondary**: `tailwind.config.js` (utility classes)
- **Legacy**: `theme.ts` (unused for typography)

### **Color Sources**
- **Primary**: `globals.css` (CSS variables)
- **Secondary**: `theme.ts` (legacy objects)
- **Tailwind**: `tailwind.config.js` (mapped to CSS vars)

### **Key Findings**
1. **Dual system**: `globals.css` + `tailwind.config.js`
2. **Deepened charcoal**: Recently adjusted (charcoal-800, -900)
3. **Typography hierarchy**: Serif (display) + Sans (body)
4. **KPI dominance**: Weight 900, size 1.15×, tabular numerals
5. **Legacy compatibility**: theme.ts defines unused values

---

## 📋 **Design System Structure**

```
globals.css (PRIMARY)
├── Typography System
│   ├── Font families (Playfair Display, DM Sans)
│   ├── Heading hierarchy (h1-h4)
│   ├── Body text styles
│   ├── KPI number styles (dominant, tabular)
│   └── Card metadata styles
│
├── Color System
│   ├── Core palettes (Cream, Mint, Berry, Charcoal)
│   ├── Semantic applications
│   ├── Text hierarchy (900 → 600)
│   └── Interactive states
│
└── Spacing & Layout
    ├── Cinematic whitespace
    ├── Macro grid system
    └── Border radius scale

tailwind.config.js (UTILITY)
├── Mapped to CSS variables
├── Extended spacing system
└── Utility classes

theme.ts (LEGACY)
├── Interface definitions
└── Legacy theme objects (minimal usage)
```

---

**Status**: ✅ Complete audit  
**Next Step**: Plan targeted refinements based on this structure

