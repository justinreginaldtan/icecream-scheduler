"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { ArrowLeft, Download, DollarSign, Users, Clock, TrendingUp } from "lucide-react"
import { payrollData, PayrollEntry } from "@/lib/data/mock-data"
import * as XLSX from "xlsx"

export default function PayrollSummaryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Restrict to managers only
  useEffect(() => {
    if (user && user.role !== "manager") {
      router.push("/unauthorized")
    }
  }, [user, router])

  // Simulate data loading (replace with MongoDB API call later)
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setLoading(true)
      // TODO: Replace with API call to MongoDB
      // const response = await apiClient.getPayroll()
      // setPayrollData(response.data)

      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
    }

    loadData()
  }, [user])

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    const totalPay = payrollData.reduce((sum, entry) => sum + entry.totalPay, 0)
    const totalHours = payrollData.reduce((sum, entry) => sum + entry.hoursWorked, 0)

    // Group by role
    const byRole = payrollData.reduce((acc, entry) => {
      if (!acc[entry.role]) {
        acc[entry.role] = {
          totalPay: 0,
          totalHours: 0,
          employees: [],
          totalHourlyRate: 0,
        }
      }
      acc[entry.role].totalPay += entry.totalPay
      acc[entry.role].totalHours += entry.hoursWorked
      acc[entry.role].employees.push(entry.employeeName)
      acc[entry.role].totalHourlyRate += entry.hourlyRate
      return acc
    }, {} as Record<string, { totalPay: number; totalHours: number; employees: string[]; totalHourlyRate: number }>)

    // Role summary statistics (sorted by total pay)
    const roleSummary = Object.entries(byRole)
      .map(([role, data]) => ({
        role,
        headcount: data.employees.length,
        totalPay: data.totalPay,
        totalHours: data.totalHours,
        avgHourlyRate: data.totalHourlyRate / data.employees.length,
        avgHoursPerEmployee: data.totalHours / data.employees.length,
        costEfficiency: data.totalHours > 0 ? data.totalPay / data.totalHours : 0, // cost per hour
        percentOfPayroll: totalPay > 0 ? (data.totalPay / totalPay) * 100 : 0,
        percentOfHours: totalHours > 0 ? (data.totalHours / totalHours) * 100 : 0,
      }))
      .sort((a, b) => b.totalPay - a.totalPay)

    // Find highest and lowest cost efficiency roles
    const sortedByEfficiency = [...roleSummary].sort((a, b) => b.costEfficiency - a.costEfficiency)
    const highestCostRole = sortedByEfficiency[0]
    const lowestCostRole = sortedByEfficiency[sortedByEfficiency.length - 1]

    return {
      totalPay,
      totalHours,
      totalRoles: roleSummary.length,
      totalEmployees: payrollData.length,
      roleSummary,
      highestCostRole,
      lowestCostRole,
    }
  }, [])

  // Excel Export function
  const exportToExcel = () => {
    const date = new Date().toISOString().split('T')[0]

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Summary Sheet Data
    const summaryData = [
      ["PAYROLL SUMMARY BY ROLE REPORT"],
      [`Generated: ${date}`],
      [`Period: ${payrollData[0]?.period || 'N/A'}`],
      [],
      ["OVERALL SUMMARY"],
      ["Metric", "Value"],
      ["Total Payroll", `$${metrics.totalPay.toLocaleString()}`],
      ["Total Hours", metrics.totalHours.toLocaleString()],
      ["Total Roles", metrics.totalRoles],
      ["Total Employees", metrics.totalEmployees],
      [],
      ["COST EFFICIENCY INSIGHTS"],
      ["Metric", "Role", "Value"],
      ["Highest Cost per Hour", metrics.highestCostRole.role, `$${metrics.highestCostRole.costEfficiency.toFixed(2)}`],
      ["Lowest Cost per Hour", metrics.lowestCostRole.role, `$${metrics.lowestCostRole.costEfficiency.toFixed(2)}`],
    ]

    // Role Summary Sheet Data
    const roleData = [
      ["ROLE SUMMARY STATISTICS"],
      [],
      ["Role", "Headcount", "Total Pay", "Total Hours", "Avg Hourly Rate", "Avg Hours/Employee", "Cost per Hour", "% of Payroll", "% of Hours"],
      ...metrics.roleSummary.map(item => [
        item.role,
        item.headcount,
        `$${item.totalPay.toLocaleString()}`,
        item.totalHours,
        `$${item.avgHourlyRate.toFixed(2)}`,
        item.avgHoursPerEmployee.toFixed(1),
        `$${item.costEfficiency.toFixed(2)}`,
        `${item.percentOfPayroll.toFixed(1)}%`,
        `${item.percentOfHours.toFixed(1)}%`
      ])
    ]

    // Create worksheets
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    const roleSheet = XLSX.utils.aoa_to_sheet(roleData)

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
    XLSX.utils.book_append_sheet(workbook, roleSheet, "Role Statistics")

    // Generate Excel file and download
    XLSX.writeFile(workbook, `payroll-summary-by-role-${date}.xlsx`)
  }

  if (user?.role !== "manager") {
    return null
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/reports")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Reports
            </Button>
            <h1 className="text-3xl font-bold text-[var(--text)]">Payroll Summary by Role</h1>
            <p className="text-[color:rgba(44,42,41,.6)] mt-1">
              Aggregate payroll statistics, headcount, and cost efficiency metrics by position
            </p>
          </div>
          <Button
            onClick={exportToExcel}
            className="bg-[var(--brandBlue)] hover:bg-[var(--brandBlue)]/90 text-white gap-2"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Payroll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                ${metrics.totalPay.toLocaleString()}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Across all roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Total Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {metrics.totalHours.toLocaleString()}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Hours worked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {metrics.totalRoles}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                {metrics.totalEmployees} employees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Cost Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                ${(metrics.totalPay / metrics.totalHours).toFixed(2)}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Avg cost per hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Cost Efficiency Insights */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Highest Cost per Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[var(--text)]">
                    {metrics.highestCostRole.role}
                  </p>
                  <p className="text-sm text-[color:rgba(44,42,41,.6)] mt-1">
                    {metrics.highestCostRole.headcount} employee(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600">
                    ${metrics.highestCostRole.costEfficiency.toFixed(2)}
                  </p>
                  <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">per hour</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lowest Cost per Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[var(--text)]">
                    {metrics.lowestCostRole.role}
                  </p>
                  <p className="text-sm text-[color:rgba(44,42,41,.6)] mt-1">
                    {metrics.lowestCostRole.headcount} employee(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    ${metrics.lowestCostRole.costEfficiency.toFixed(2)}
                  </p>
                  <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">per hour</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Summary Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Role Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Headcount</TableHead>
                  <TableHead className="text-right">Total Pay</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="text-right">Avg Hourly Rate</TableHead>
                  <TableHead className="text-right">Avg Hours/Employee</TableHead>
                  <TableHead className="text-right">Cost per Hour</TableHead>
                  <TableHead className="text-right">% of Payroll</TableHead>
                  <TableHead className="text-right">% of Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.roleSummary.map((item) => (
                  <TableRow key={item.role}>
                    <TableCell className="font-medium">{item.role}</TableCell>
                    <TableCell className="text-right">{item.headcount}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${item.totalPay.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{item.totalHours}</TableCell>
                    <TableCell className="text-right">${item.avgHourlyRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.avgHoursPerEmployee.toFixed(1)}</TableCell>
                    <TableCell className="text-right">${item.costEfficiency.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-[var(--brandBlue)] font-medium">
                        {item.percentOfPayroll.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[color:rgba(44,42,41,.6)]">
                        {item.percentOfHours.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
