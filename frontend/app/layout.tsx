import type React from "react"
import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth/auth-context"
import { SidebarProvider } from "@/lib/sidebar-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sweet Solutions - Scheduling & Payroll",
  description: "Internal scheduling and payroll management for Howdy Homemade",
  generator: "v0.app",
  icons: {
    icon: '/howdyslogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --bg: linear-gradient(to bottom, #FFFDFC 0%, #FFF5EC 20%);
            --bg-vanilla-warm: #FFFDFC;
            --bg-vanilla-light: #FFF5EC;
            --surface: #FFFFFF;
            --text: #4E463E;
            --border: rgba(0,0,0,0.04);
            --primary: #C46A2F;
            --primary-bright: #D07A3D;
            --primary-gradient: linear-gradient(135deg, #C46A2F 0%, #A45328 100%);
            --brandBlue: #9CCBEB;
            --brandPink: #F9A9A7;
            --muted: #FFF5EC;
            --sidebar: #E8F4F1;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        <SidebarProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
