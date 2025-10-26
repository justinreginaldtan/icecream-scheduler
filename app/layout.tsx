import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
            --bg: #FFF3EA;
            --surface: #FFFFFF;
            --text: #333333;
            --border: #E8E3DD;
            --primary: #FFB7B2;
            --strawberry: #FFB7B2;
            --mint: #A0E7E5;
            --vanilla: #FFEE93;
            --muted: #FFF3EA;
          }
        `}</style>
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-[#FFF3EA]`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
