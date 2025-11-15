"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { ArrowLeft, Download, DollarSign, TrendingUp, Users, Briefcase } from "lucide-react"
import { payrollData, PayrollEntry } from "@/lib/data/mock-data"
import * as XLSX from "xlsx"

export default function LaborCostAnalysisPage() {
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
    const totalCost = payrollData.reduce((sum, entry) => sum + entry.totalPay, 0)
    const totalHours = payrollData.reduce((sum, entry) => sum + entry.hoursWorked, 0)
    const avgHourlyRate = totalHours > 0 ? totalCost / totalHours : 0

    // Group by role
    const byRole = payrollData.reduce((acc, entry) => {
      if (!acc[entry.role]) {
        acc[entry.role] = {
          totalPay: 0,
          totalHours: 0,
          count: 0,
        }
      }
      acc[entry.role].totalPay += entry.totalPay
      acc[entry.role].totalHours += entry.hoursWorked
      acc[entry.role].count += 1
      return acc
    }, {} as Record<string, { totalPay: number; totalHours: number; count: number }>)

    // Cost by role (sorted by total pay)
    const costByRole = Object.entries(byRole)
      .map(([role, data]) => ({
        role,
        totalPay: data.totalPay,
        totalHours: data.totalHours,
        avgHourlyRate: data.totalHours > 0 ? data.totalPay / data.totalHours : 0,
        employeeCount: data.count,
        percentOfTotal: totalCost > 0 ? (data.totalPay / totalCost) * 100 : 0,
      }))
      .sort((a, b) => b.totalPay - a.totalPay)

    // Employee cost rankings (sorted by total pay)
    const employeeRankings = [...payrollData]
      .sort((a, b) => b.totalPay - a.totalPay)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
        percentOfTotal: totalCost > 0 ? (entry.totalPay / totalCost) * 100 : 0,
      }))

    return {
      totalCost,
      totalHours,
      avgHourlyRate,
      employeeCount: payrollData.length,
      costByRole,
      employeeRankings,
    }
  }, [])

  // Enhanced Excel Export function with all report data
  const exportToExcel = () => {
    const date = new Date().toISOString().split('T')[0]

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Summary Sheet Data
    const summaryData = [
      ["LABOR COST ANALYSIS REPORT"],
      [`Generated: ${date}`],
      [`Period: ${payrollData[0]?.period || 'N/A'}`],
      [],
      ["SUMMARY METRICS"],
      ["Metric", "Value"],
      ["Total Labor Cost", `$${metrics.totalCost.toLocaleString()}`],
      ["Total Hours", metrics.totalHours.toLocaleString()],
      ["Average Hourly Rate", `$${metrics.avgHourlyRate.toFixed(2)}`],
      ["Total Employees", metrics.employeeCount],
    ]

    // Cost Breakdown by Role Sheet Data
    const roleData = [
      ["COST BREAKDOWN BY ROLE"],
      [],
      ["Role", "Employees", "Total Hours", "Avg Hourly Rate", "Total Cost", "% of Total"],
      ...metrics.costByRole.map(item => [
        item.role,
        item.employeeCount,
        item.totalHours,
        `$${item.avgHourlyRate.toFixed(2)}`,
        `$${item.totalPay.toLocaleString()}`,
        `${item.percentOfTotal.toFixed(1)}%`
      ])
    ]

    // Employee Rankings Sheet Data
    const employeeData = [
      ["EMPLOYEE COST RANKINGS"],
      [],
      ["Rank", "Employee", "Role", "Hours Worked", "Hourly Rate", "Total Pay", "% of Total"],
      ...metrics.employeeRankings.map(emp => [
        emp.rank,
        emp.employeeName,
        emp.role,
        emp.hoursWorked,
        `$${emp.hourlyRate.toFixed(2)}`,
        `$${emp.totalPay.toLocaleString()}`,
        `${emp.percentOfTotal.toFixed(1)}%`
      ])
    ]

    // Create worksheets
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    const roleSheet = XLSX.utils.aoa_to_sheet(roleData)
    const employeeSheet = XLSX.utils.aoa_to_sheet(employeeData)

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
    XLSX.utils.book_append_sheet(workbook, roleSheet, "Cost by Role")
    XLSX.utils.book_append_sheet(workbook, employeeSheet, "Employee Rankings")

    // Generate Excel file and download
    XLSX.writeFile(workbook, `labor-cost-analysis-${date}.xlsx`)
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
            <h1 className="text-3xl font-bold text-[var(--text)]">Labor Cost Analysis</h1>
            <p className="text-[color:rgba(44,42,41,.6)] mt-1">
              Detailed breakdown of labor costs, employee expenses, and role-based analysis
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
                Total Labor Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                ${metrics.totalCost.toLocaleString()}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">January 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
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
                <Briefcase className="w-4 h-4" />
                Avg Hourly Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                ${metrics.avgHourlyRate.toFixed(2)}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Across all employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {metrics.employeeCount}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Active employees</p>
            </CardContent>
          </Card>
        </div>

        {/* Cost by Role */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cost Breakdown by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="text-right">Avg Hourly Rate</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.costByRole.map((item) => (
                  <TableRow key={item.role}>
                    <TableCell className="font-medium">{item.role}</TableCell>
                    <TableCell className="text-right">{item.employeeCount}</TableCell>
                    <TableCell className="text-right">{item.totalHours}</TableCell>
                    <TableCell className="text-right">${item.avgHourlyRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${item.totalPay.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[var(--brandBlue)] font-medium">
                        {item.percentOfTotal.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Employee Cost Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Cost Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Hours Worked</TableHead>
                  <TableHead className="text-right">Hourly Rate</TableHead>
                  <TableHead className="text-right">Total Pay</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.employeeRankings.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">#{employee.rank}</TableCell>
                    <TableCell>{employee.employeeName}</TableCell>
                    <TableCell className="text-[color:rgba(44,42,41,.6)]">
                      {employee.role}
                    </TableCell>
                    <TableCell className="text-right">{employee.hoursWorked}</TableCell>
                    <TableCell className="text-right">${employee.hourlyRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${employee.totalPay.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[var(--brandBlue)] font-medium">
                        {employee.percentOfTotal.toFixed(1)}%
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
