"use client"

import { useState, useEffect, useMemo } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown } from "lucide-react"
import { ShiftModal } from "@/components/features/shifts/shift-modal"
import apiClient from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import type { Shift, Employee } from "@/lib/data/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function SchedulePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [dateRange, setDateRange] = useState("This week")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [employeesRes, shiftsRes] = await Promise.all([
          apiClient.getEmployees(),
          apiClient.getShifts()
        ])
        
        if (employeesRes.success) {
          setEmployees((employeesRes.data || []).map((emp: any) => ({
            ...emp,
            id: emp.id?.toString?.() ?? "",
          })))
        }
        if (shiftsRes.success) {
          setShifts((shiftsRes.data || []).map((shift: any) => ({
            ...shift,
            id: shift.id?.toString?.() ?? "",
            employeeId: shift.employeeId?.toString?.() ?? "",
          })))
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Get current week dates
  const getWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // Adjust to Monday
    const monday = new Date(today.setDate(diff))

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = useMemo(getWeekDates, [])

  // Group shifts by date and employee
  const getShiftForDateAndEmployee = (date: Date, employeeId: string) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts.find((shift) => shift.date === dateStr && shift.employeeId === employeeId)
  }

  const handleAddShift = () => {
    setSelectedShift(null)
    setIsModalOpen(true)
  }

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift)
    setIsModalOpen(true)
  }

  const handleDateRangeClick = () => {
    const options = ["This week", "Next week", "Last week"] as const
    const currentIndex = options.indexOf(dateRange as typeof options[number])
    const nextValue = options[(currentIndex + 1) % options.length]
    setDateRange(nextValue)
    toast({
      title: "Date range updated",
      description: `Showing ${nextValue.toLowerCase()}.`,
      className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
    })
  }

  const handleShiftCreated = (newShift: Shift) => {
    setShifts((prev) => [...prev, newShift])
  }

  const handleShiftUpdated = (updatedShift: Shift) => {
    setShifts((prev) => prev.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift)))
  }

  const handleShiftDeleted = (shiftId: string) => {
    setShifts((prev) => prev.filter((shift) => shift.id !== shiftId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedShift(null)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[color:rgba(44,42,41,.6)]">Loading schedule...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        <div className="mb-10 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2" style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.1', color: '#2A2A2A', fontFamily: 'var(--font-display)' }}>
                Weekly Schedule
              </h1>
              <p className="text-base" style={{ color: '#575757', fontWeight: '500' }}>
                Build your team's schedule for the week ahead
              </p>
            </div>
            <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none bg-transparent"
              data-testid="date-range-selector"
              onClick={handleDateRangeClick}
            >
              {dateRange} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddShift}
              variant="default"
              style={{ borderRadius: 'var(--radius-md)' }}
              data-testid="add-shift-button"
              aria-label="Add new shift"
            >
              <Plus className="mr-2 h-4 w-4" />
              Schedule a Shift
            </Button>
            </div>
          </div>
        </div>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              Week of {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </CardTitle>
            <CardDescription>Tap any shift to make changes or see details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-semibold text-sm text-[color:rgba(44,42,41,.7)]">Employee</div>
                  {weekDates.map((date, idx) => (
                    <div key={idx} className="text-center">
                      <div className="font-semibold text-sm text-[var(--text)]">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-xs text-[color:rgba(44,42,41,.6)]">{date.getDate()}</div>
                    </div>
                  ))}
                </div>

                {employees.map((employee) => (
                  <div key={employee.id} className="grid grid-cols-8 gap-2 mb-3">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-sm text-[var(--text)]">{employee.name}</div>
                        <div className="text-xs text-[color:rgba(44,42,41,.6)]">{employee.role}</div>
                      </div>
                    </div>

                    {weekDates.map((date, idx) => {
                      const shift = getShiftForDateAndEmployee(date, employee.id)
                      return (
                        <div key={idx} className="min-h-[60px]">
                          {shift ? (
                            <button
                              type="button"
                              onClick={() => handleEditShift(shift)}
                              className="w-full h-full rounded-lg bg-[color:rgba(73,182,194,.1)] border border-[color:rgba(73,182,194,.2)] p-2 text-left transition-colors duration-200 hover:bg-[color:rgba(73,182,194,.2)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                              aria-label={`Edit shift for ${employee.name} on ${date.toLocaleDateString()}`}
                              data-testid={`shift-${employee.id}-${idx}`}
                            >
                              <div className="text-xs font-medium text-[var(--text)]">
                                {shift.startTime} - {shift.endTime}
                              </div>
                              <div className="text-xs text-[color:rgba(44,42,41,.6)] mt-0.5">{shift.role}</div>
                            </button>
                          ) : (
                            <div className="w-full h-full rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)]/30" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {shifts.length === 0 && (
              <div className="text-center py-16 space-y-5">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[rgba(220,243,238,0.3)] to-[rgba(183,231,223,0.2)] rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                  <Calendar className="h-10 w-10 text-[color:rgba(68,176,156,0.7)]" />
                </div>
                <div className="space-y-2.5">
                      <h3 className="text-xl font-bold" style={{ color: 'var(--charcoal-800)', fontFamily: 'var(--font-display)' }}>
                    All set — smooth as cream
                  </h3>
                  <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--charcoal-600)', fontWeight: '400' }}>
                    Your schedule is clear this week. Ready to scoop your first shift?
                  </p>
                </div>
                <Button
                  onClick={handleAddShift}
                  variant="default"
                  className="mt-4"
                  style={{ borderRadius: 'var(--radius-md)', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Your First Shift
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Shift Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shift={selectedShift}
        onCreate={handleShiftCreated}
        onUpdate={handleShiftUpdated}
        onDelete={handleShiftDeleted}
      />
    </AppLayout>
  )
}
