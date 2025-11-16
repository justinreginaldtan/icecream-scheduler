"use client"

import Link from "next/link"
import { Calendar, DollarSign, FileText, LayoutDashboard } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"

const actions = [
  {
    title: "View Schedule",
    description: "See everyone’s shifts for the week.",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "My Payroll",
    description: "Check your pay and hours worked.",
    href: "/payroll",
    icon: DollarSign,
  },
  {
    title: "Request Time Off",
    description: "Submit a request for vacation or sick leave.",
    href: "/requests",
    icon: FileText,
  },
]

export default function EmployeeDashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(" ")?.[0] || "there"

  return (
    <AppLayout>
      <div className="space-y-10">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[color:rgba(73,182,194,.15)] p-3">
            <LayoutDashboard className="h-6 w-6 text-[var(--brandBlue)]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Welcome, {firstName}</h1>
            <p className="text-[color:rgba(44,42,41,.6)]">
              Quick links to your schedule, pay, and time-off requests.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {actions.map((action) => (
            <Card
              key={action.title}
              className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                  <action.icon className="h-5 w-5 text-[var(--brandBlue)]" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[color:rgba(44,42,41,.7)] text-sm">{action.description}</p>
                <Button
                  asChild
                  className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                >
                  <Link href={action.href}>Go to {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
