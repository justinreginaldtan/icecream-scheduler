"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { ArrowLeft, Download, Clock, TrendingUp, Users, BarChart } from "lucide-react"
import { payrollData, PayrollEntry } from "@/lib/data/mock-data"
import * as XLSX from "xlsx"

export default function HoursProductivityPage() {
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
    const totalHours = payrollData.reduce((sum, entry) => sum + entry.hoursWorked, 0)
    const avgHoursPerEmployee = totalHours / payrollData.length

    // Group by role for hours distribution
    const byRole = payrollData.reduce((acc, entry) => {
      if (!acc[entry.role]) {
        acc[entry.role] = {
          totalHours: 0,
          count: 0,
        }
      }
      acc[entry.role].totalHours += entry.hoursWorked
      acc[entry.role].count += 1
      return acc
    }, {} as Record<string, { totalHours: number; count: number }>)

    // Hours distribution by role
    const hoursDistribution = Object.entries(byRole)
      .map(([role, data]) => ({
        role,
        totalHours: data.totalHours,
        employeeCount: data.count,
        avgHours: data.totalHours / data.count,
        percentOfTotal: totalHours > 0 ? (data.totalHours / totalHours) * 100 : 0,
      }))
      .sort((a, b) => b.totalHours - a.totalHours)

    // Employee utilization rankings (sorted by hours worked)
    const employeeRankings = [...payrollData]
      .sort((a, b) => b.hoursWorked - a.hoursWorked)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
        percentOfTotal: totalHours > 0 ? (entry.hoursWorked / totalHours) * 100 : 0,
        workType: entry.hoursWorked >= 120 ? "Full-Time" : "Part-Time", // Assuming 120+ hours is full-time
      }))

    // Full-time vs Part-time analysis
    const fullTimeCount = employeeRankings.filter(e => e.workType === "Full-Time").length
    const partTimeCount = employeeRankings.filter(e => e.workType === "Part-Time").length
    const fullTimeHours = employeeRankings
      .filter(e => e.workType === "Full-Time")
      .reduce((sum, e) => sum + e.hoursWorked, 0)
    const partTimeHours = employeeRankings
      .filter(e => e.workType === "Part-Time")
      .reduce((sum, e) => sum + e.hoursWorked, 0)

    return {
      totalHours,
      avgHoursPerEmployee,
      employeeCount: payrollData.length,
      hoursDistribution,
      employeeRankings,
      fullTimeCount,
      partTimeCount,
      fullTimeHours,
      partTimeHours,
    }
  }, [])

  // Excel Export function
  const exportToExcel = () => {
    const date = new Date().toISOString().split('T')[0]

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Summary Sheet Data
    const summaryData = [
      ["HOURS & PRODUCTIVITY REPORT"],
      [`Generated: ${date}`],
      [`Period: ${payrollData[0]?.period || 'N/A'}`],
      [],
      ["SUMMARY METRICS"],
      ["Metric", "Value"],
      ["Total Hours Worked", metrics.totalHours.toLocaleString()],
      ["Average Hours per Employee", metrics.avgHoursPerEmployee.toFixed(1)],
      ["Total Employees", metrics.employeeCount],
      ["Full-Time Employees", metrics.fullTimeCount],
      ["Part-Time Employees", metrics.partTimeCount],
      [],
      ["WORK TYPE BREAKDOWN"],
      ["Type", "Employees", "Total Hours", "% of Hours"],
      ["Full-Time", metrics.fullTimeCount, metrics.fullTimeHours, `${((metrics.fullTimeHours / metrics.totalHours) * 100).toFixed(1)}%`],
      ["Part-Time", metrics.partTimeCount, metrics.partTimeHours, `${((metrics.partTimeHours / metrics.totalHours) * 100).toFixed(1)}%`],
    ]

    // Hours Distribution by Role Sheet Data
    const roleData = [
      ["HOURS DISTRIBUTION BY ROLE"],
      [],
      ["Role", "Employees", "Total Hours", "Avg Hours", "% of Total"],
      ...metrics.hoursDistribution.map(item => [
        item.role,
        item.employeeCount,
        item.totalHours,
        item.avgHours.toFixed(1),
        `${item.percentOfTotal.toFixed(1)}%`
      ])
    ]

    // Employee Utilization Rankings Sheet Data
    const employeeData = [
      ["EMPLOYEE UTILIZATION RANKINGS"],
      [],
      ["Rank", "Employee", "Role", "Hours Worked", "% of Total", "Work Type"],
      ...metrics.employeeRankings.map(emp => [
        emp.rank,
        emp.employeeName,
        emp.role,
        emp.hoursWorked,
        `${emp.percentOfTotal.toFixed(1)}%`,
        emp.workType
      ])
    ]

    // Create worksheets
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    const roleSheet = XLSX.utils.aoa_to_sheet(roleData)
    const employeeSheet = XLSX.utils.aoa_to_sheet(employeeData)

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
    XLSX.utils.book_append_sheet(workbook, roleSheet, "Hours by Role")
    XLSX.utils.book_append_sheet(workbook, employeeSheet, "Employee Rankings")

    // Generate Excel file and download
    XLSX.writeFile(workbook, `hours-productivity-${date}.xlsx`)
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
            <h1 className="text-3xl font-bold text-[var(--text)]">Hours & Productivity</h1>
            <p className="text-[color:rgba(44,42,41,.6)] mt-1">
              Track employee hours worked, utilization patterns, and productivity metrics
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
                <TrendingUp className="w-4 h-4" />
                Avg Hours/Employee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {metrics.avgHoursPerEmployee.toFixed(1)}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">Per employee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Full-Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {metrics.fullTimeCount}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                {metrics.fullTimeHours} hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[color:rgba(44,42,41,.6)] flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Part-Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">
                {metrics.partTimeCount}
              </div>
              <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                {metrics.partTimeHours} hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hours Distribution by Role */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hours Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="text-right">Avg Hours</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.hoursDistribution.map((item) => (
                  <TableRow key={item.role}>
                    <TableCell className="font-medium">{item.role}</TableCell>
                    <TableCell className="text-right">{item.employeeCount}</TableCell>
                    <TableCell className="text-right">{item.totalHours}</TableCell>
                    <TableCell className="text-right">{item.avgHours.toFixed(1)}</TableCell>
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

        {/* Employee Utilization Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Utilization Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Hours Worked</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                  <TableHead className="text-right">Work Type</TableHead>
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
                    <TableCell className="text-right font-semibold">
                      {employee.hoursWorked}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[var(--brandBlue)] font-medium">
                        {employee.percentOfTotal.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        employee.workType === "Full-Time"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {employee.workType}
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
