"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, FileText, TrendingUp, ChevronDown } from "lucide-react"
import { employees, shifts, timeOffRequests } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { ShiftModal } from "@/components/shift-modal"

export default function DashboardPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState("This week")
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)

  const totalEmployees = employees.length
  const totalHoursThisWeek = employees.reduce((sum, emp) => sum + emp.hours, 0)
  const pendingRequests = timeOffRequests.filter((req) => req.status === "pending").length
  const upcomingShifts = shifts.filter((shift) => new Date(shift.date) >= new Date()).length

  const nextShift = shifts.find((shift) => shift.employeeId === 1 && new Date(shift.date) >= new Date())

  return (
    <AppLayout>
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text)]">Welcome back, {user?.name.split(" ")[0]}</h1>
                <p className="text-[color:rgba(51,51,51,.65)] mt-1">Overview of your team and schedule</p>
              </div>
              <Button
                variant="outline"
                className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--muted)]"
                data-testid="date-range-selector"
              >
                {dateRange} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
              <div className="bg-gradient-to-br from-[#A0E7E5] to-[#FFEE93] p-[2px] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <div className="bg-white rounded-2xl p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#666] mb-1">Total Employees</p>
                      <p className="text-3xl font-bold text-[#333] mb-1">{totalEmployees}</p>
                      <p className="text-xs text-[#999]">Active team members</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#A0E7E5] to-[#B9F3F2] rounded-xl p-2.5 shadow-sm">
                      <Users className="h-6 w-6 text-[#49A0B0]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#FFB7B2] to-[#FFEE93] p-[2px] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <div className="bg-white rounded-2xl p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#666] mb-1">Hours This Week</p>
                      <p className="text-3xl font-bold text-[#333] mb-1">{totalHoursThisWeek}</p>
                      <p className="text-xs text-[#999]">Scheduled hours</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFB7B2] to-[#FFD1CE] rounded-xl p-2.5 shadow-sm">
                      <Clock className="h-6 w-6 text-[#E85F52]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#FFEE93] to-[#A0E7E5] p-[2px] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <div className="bg-white rounded-2xl p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#666] mb-1">Pending Requests</p>
                      <p className="text-3xl font-bold text-[#333] mb-1">{pendingRequests}</p>
                      <p className="text-xs text-[#999]">Awaiting approval</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFEE93] to-[#FFF5B8] rounded-xl p-2.5 shadow-sm">
                      <FileText className="h-6 w-6 text-[#D4A847]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#A0E7E5] to-[#FFB7B2] p-[2px] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <div className="bg-white rounded-2xl p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#666] mb-1">Upcoming Shifts</p>
                      <p className="text-3xl font-bold text-[#333] mb-1">{upcomingShifts}</p>
                      <p className="text-xs text-[#999]">Next 7 days</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#A0E7E5] to-[#B9F3F2] rounded-xl p-2.5 shadow-sm">
                      <TrendingUp className="h-6 w-6 text-[#49A0B0]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[var(--text)]">Your Next Shift</CardTitle>
                  <CardDescription>Upcoming schedule details</CardDescription>
                </CardHeader>
                <CardContent>
                  {nextShift ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:rgba(51,51,51,.7)]">Date</span>
                        <span className="font-medium text-[var(--text)]">
                          {new Date(nextShift.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:rgba(51,51,51,.7)]">Time</span>
                        <span className="font-medium text-[var(--text)]">
                          {nextShift.startTime} - {nextShift.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[color:rgba(51,51,51,.7)]">Role</span>
                        <span className="font-medium text-[var(--text)]">{nextShift.role}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-[color:rgba(51,51,51,.7)]">No upcoming shifts — create the first one.</p>
                      <Button
                        variant="gradient"
                        onClick={() => setIsShiftModalOpen(true)}
                        data-testid="create-first-shift"
                        aria-label="Create your first shift"
                      >
                        Create Shift
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[var(--text)]">Recent Activity</CardTitle>
                  <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 bg-[#FFB7B2]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text)]">New time-off request</p>
                        <p className="text-xs text-[color:rgba(51,51,51,.6)]">
                          Chatcha requested time off for Jan 25-27
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 bg-[#FFB7B2]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text)]">Schedule updated</p>
                        <p className="text-xs text-[color:rgba(51,51,51,.6)]">5 new shifts added for next week</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 bg-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text)]">Payroll processed</p>
                        <p className="text-xs text-[color:rgba(51,51,51,.6)]">January payroll completed successfully</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

      <ShiftModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </AppLayout>
  )
}
