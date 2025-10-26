import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth/auth-context"
import { SidebarProvider } from "@/lib/sidebar-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
            --bg: linear-gradient(to bottom, #FBE5CF 0%, #FFF6EF 100%);
            --bg-vanilla-warm: #FBE5CF;
            --bg-vanilla-light: #FFF6EF;
            --surface: #FFFFFF;
            --text: #2A1E16;
            --border: rgba(0,0,0,0.06);
            --primary: #F86E5A;
            --primary-bright: #FF8B6E;
            --primary-gradient: linear-gradient(to bottom right, #F86E5A, #FF8B6E);
            --brandBlue: #49B6C2;
            --brandPink: #F04E98;
            --muted: #FFF6EF;
            --sidebar: #B8EDE1;
          }
        `}</style>
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
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
