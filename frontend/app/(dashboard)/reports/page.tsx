"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart3, PieChart, Timer, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "manager") {
      router.push("/unauthorized")
    }
  }, [user, router])

  if (user?.role !== "manager") {
    return null
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)]">Reports</h1>
          <p className="text-[color:rgba(44,42,41,.6)] mt-1">
            Insights for staffing and payroll. Placeholders shown while we wire data.
          </p>
        </div>

        {/* Summary cards (placeholders) */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">This Period</CardTitle>
              <CardDescription>High‑level snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
                <div className="space-y-1">
                  <div className="h-6 w-28 bg-[var(--muted)]/50 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-[var(--muted)]/50 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Overtime Risk</CardTitle>
              <CardDescription>Who is trending over 40h</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-[var(--primary)]" />
                <div className="space-y-1">
                  <div className="h-6 w-24 bg-[var(--muted)]/50 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-[var(--muted)]/50 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Labor by Role</CardTitle>
              <CardDescription>Mix of hours and cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <PieChart className="h-5 w-5 text-[var(--primary)]" />
                <div className="space-y-1">
                  <div className="h-6 w-20 bg-[var(--muted)]/50 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-[var(--muted)]/50 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report 1: Period Summary (placeholder) */}
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
              <CardTitle className="text-[var(--text)]">Period Summary</CardTitle>
            </div>
            <CardDescription>Totals and per‑employee breakdown for a selected payroll period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="h-14 bg-[var(--muted)]/40 rounded-lg animate-pulse" />
              <div className="h-14 bg-[var(--muted)]/40 rounded-lg animate-pulse" />
              <div className="h-14 bg-[var(--muted)]/40 rounded-lg animate-pulse" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[var(--text)]">Employee</TableHead>
                  <TableHead className="text-[var(--text)]">Role</TableHead>
                  <TableHead className="text-right text-[var(--text)]">Hours</TableHead>
                  <TableHead className="text-right text-[var(--text)]">Overtime</TableHead>
                  <TableHead className="text-right text-[var(--text)]">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-[var(--muted)]/40">
                    <TableCell>
                      <div className="h-4 w-32 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-4 w-12 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-4 w-12 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-4 w-16 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report 2: Overtime Insights (placeholder) */}
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-[var(--primary)]" />
              <CardTitle className="text-[var(--text)]">Overtime Insights</CardTitle>
            </div>
            <CardDescription>Top employees by overtime hours and pay</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 h-40 w-full bg-[var(--muted)]/30 rounded-xl animate-pulse" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[var(--text)]">Employee</TableHead>
                  <TableHead className="text-right text-[var(--text)]">Overtime Hours</TableHead>
                  <TableHead className="text-right text-[var(--text)]">Overtime Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-[var(--muted)]/40">
                    <TableCell>
                      <div className="h-4 w-36 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-4 w-16 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-4 w-20 bg-[var(--muted)]/50 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report 3: Labor Cost by Role (placeholder) */}
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-[var(--primary)]" />
              <CardTitle className="text-[var(--text)]">Labor Cost by Role</CardTitle>
            </div>
            <CardDescription>Hours and net pay aggregated by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-48 w-full bg-[var(--muted)]/30 rounded-xl animate-pulse" />
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[var(--text)]">Role</TableHead>
                      <TableHead className="text-right text-[var(--text)]">Hours</TableHead>
                      <TableHead className="text-right text-[var(--text)]">Net Pay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-[var(--muted)]/40">
                        <TableCell>
                          <div className="h-4 w-28 bg-[var(--muted)]/50 rounded animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="ml-auto h-4 w-14 bg-[var(--muted)]/50 rounded animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="ml-auto h-4 w-20 bg-[var(--muted)]/50 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

