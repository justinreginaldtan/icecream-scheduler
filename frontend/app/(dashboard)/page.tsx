"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { ShiftModal } from "@/components/features/shifts/shift-modal"
import { AddEmployeeModal } from "@/components/features/employees/add-employee-modal"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState("Today")
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const cycleDateRange = () => {
    const options = ["Today", "This Week", "This Month"] as const
    const currentIndex = options.indexOf(dateRange as (typeof options)[number])
    const nextValue = options[(currentIndex + 1) % options.length]
    setDateRange(nextValue)
    toast({
      title: "Date range updated",
      description: `Dashboard metrics now reflect ${nextValue.toLowerCase()}.`,
      className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
    })
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="animate-slide-up">
            <h1 className="section-title mb-1">Welcome back, {user?.name.split(" ")[0]}</h1>
            <p className="text-body-text-muted">An at-a-glance overview of your shop today.</p>
          </div>
          <Button
            variant="outline"
            className="animate-slide-up"
            data-testid="date-range-selector"
            onClick={cycleDateRange}
          >
            {dateRange} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* 1. Today's Summary */}
        <motion.div variants={cardVariants}>
          <Card className="group border-[var(--accent-primary-soft)] bg-gradient-to-br from-berry-100 to-berry-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Today's Summary</span>
                <span className="text-sm font-medium text-success flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Fully Staffed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-body-text-muted">Open Shifts</p>
                <p className="text-2xl font-bold">0 / 8</p>
              </div>
              <div>
                <p className="text-sm text-body-text-muted">Staff Scheduled</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div>
                <p className="text-sm text-body-text-muted">Hours So Far</p>
                <p className="text-2xl font-bold">12.5 / 40</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Current Shifts */}
        <div className="mt-4">
          <h2 className="dashboard-section-title">Current Shifts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3">
              <CardContent>Ava – Scooper, 3h 17m</CardContent>
            </Card>
            <Card className="p-3">
              <CardContent>Leo – Cashier, 2h 45m</CardContent>
            </Card>
            <Card className="p-3">
              <CardContent>Mia – Toppings, 1h 5m</CardContent>
            </Card>
            <Card className="p-3 border-dashed">
              <CardContent className="text-body-text-muted">+2 more</CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 3. Pending Actions */}
            <div className="mt-4">
              <h2 className="dashboard-section-title">Pending Actions</h2>
              <Card>
                <CardContent className="divide-y divide-border-subtle">
                  <div className="p-4 flex items-center justify-between">
                    <span>Time Off: Justin Tan (Oct 28-30)</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => toast({ title: "Review Clicked" })}
                    >
                      Review
                    </Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span>Shift Swap: Ava for Leo (Oct 29)</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => toast({ title: "Review Clicked" })}
                    >
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 5. Recent Activity Feed */}
            <div className="mt-4">
              <h2 className="dashboard-section-title">Recent Activity</h2>
              <Card>
                <CardContent>
                  <div className="space-y-2.5 pt-6">
                    <div className="group/item flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-1.5 bg-accent flex-shrink-0" />
                      <p className="text-sm text-body-text-muted">
                        Chatcha's time-off request for Jan 25-27 was approved.
                      </p>
                    </div>
                    <div className="group/item flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-1.5 bg-accent-secondary flex-shrink-0" />
                      <p className="text-sm text-body-text-muted">
                        5 new shifts were added for next week.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Column (Unified Action Panel) */}
          <div className="space-y-8">
            <Card className="p-4">
              {/* 4. Quick Actions */}
              <div className="mt-4">
                <h2 className="dashboard-section-title">Quick Actions</h2>
                <div className="flex flex-col space-y-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="btn-primary w-full"
                      onClick={() => setIsShiftModalOpen(true)}
                    >
                      Create Shift
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="btn-primary w-full"
                      onClick={() => setIsAddEmployeeModalOpen(true)}
                    >
                      Add Employee
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toast({ title: "Approve All Clicked" })}
                    >
                      Approve All
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toast({ title: "Run Payroll Clicked" })}
                    >
                      Run Payroll
                    </Button>
                  </motion.div>
                </div>
              </div>

              <hr className="my-6 border-border-subtle" />

              {/* 6. Sweet Moment */}
              <div className="mt-4">
                <h2 className="dashboard-section-title">Sweet Moment</h2>
                <Card className="bg-gradient-to-br from-mint-100 to-mint-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Staff of the Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold text-lg">🎉 Ava!</p>
                    <p className="text-sm text-body-text-muted">For amazing customer feedback.</p>
                  </CardContent>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ShiftModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
      />
    </AppLayout>
  )
}
