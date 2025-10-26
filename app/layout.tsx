import type React from "react"
import type { Metadata } from "next"
import { Fredoka, Nunito_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sweet Solutions - Scheduling & Payroll",
  description: "Internal scheduling and payroll management for Howdy Homemade",
  generator: "v0.app",
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
            --bg: #FCE8D9;
            --surface: #FFFFFF;
            --text: #1E1E1E;
            --text-secondary: #666666;
            --border: #E8D9C9;
            --primary: #F86E5A;
            --strawberry: #FFB7B2;
            --mint: #A0E7E5;
            --vanilla: #FFEE93;
            --muted: #FCE8D9;
            --sidebar-text: #27524F;
          }
        `}</style>
      </head>
      <body className={`${fredoka.variable} ${nunitoSans.variable} font-sans antialiased`} style={{ background: 'linear-gradient(to bottom, #FBE5CF 0%, #FFF6EF 100%)' }}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
