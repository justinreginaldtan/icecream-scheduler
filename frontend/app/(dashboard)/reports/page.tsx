"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  BarChart3,
  DollarSign,
  Clock,
  PieChart
} from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Restrict to managers only
  useEffect(() => {
    if (user && user.role !== "manager") {
      router.push("/unauthorized")
    }
  }, [user, router])

  if (user?.role !== "manager") {
    return null
  }

  const reports = [
    {
      title: "Labor Cost Analysis",
      description: "Analyze total payroll costs, cost breakdown by role, and labor cost trends. View employee cost rankings and hourly rate averages.",
      icon: DollarSign,
      href: "/reports/labor-cost",
      color: "text-green-600",
      bgColor: "bg-green-50",
      dataUsed: "Employee, Role, Hours Worked, Hourly Rate, Total Pay, Period"
    },
    {
      title: "Hours & Productivity",
      description: "Track total hours worked per employee, hours distribution by role, and employee utilization rankings. Analyze full-time vs part-time patterns.",
      icon: Clock,
      href: "/reports/hours-productivity",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dataUsed: "Employee, Role, Hours Worked, Period"
    },
    {
      title: "Payroll Summary by Role",
      description: "View aggregate payroll statistics by role including total pay, average hours, headcount, and cost efficiency metrics across all positions.",
      icon: PieChart,
      href: "/reports/payroll-summary",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      dataUsed: "Role, Hours Worked, Hourly Rate, Total Pay, Period"
    },
  ]

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)]">Reports</h1>
          <p className="text-[color:rgba(44,42,41,.6)] mt-1">
            Analyze payroll data and export business insights from employee hours and cost metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)]">
                Available Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{reports.length}</div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Different report types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)]">
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">Payroll</div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Employee hours & costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)]">
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">CSV</div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Downloadable reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon
            return (
              <Card
                key={report.href}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                onClick={() => router.push(report.href)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-[var(--brandBlue)] hover:bg-[var(--brandBlue)]/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(report.href)
                    }}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Report Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--text)] mb-2">Mock Data Ready</h3>
                <p className="text-sm text-[color:rgba(44,42,41,.6)]">
                  Currently using payroll CSV data. MongoDB integration ready for production deployment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] mb-2">Export Options</h3>
                <p className="text-sm text-[color:rgba(44,42,41,.6)]">
                  Download reports in CSV format for further analysis and record keeping
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] mb-2">Detailed Insights</h3>
                <p className="text-sm text-[color:rgba(44,42,41,.6)]">
                  View breakdowns by employee, role, and period with key performance metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
