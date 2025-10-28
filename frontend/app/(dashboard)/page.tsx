"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, FileText, TrendingUp, ChevronDown, ArrowRight, Calendar, AlertCircle, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { ShiftModal } from "@/components/features/shifts/shift-modal"
import { useNav } from "@/lib/utils/navigation"
import apiClient from "@/lib/api/client"

export default function DashboardPage() {
  const { user } = useAuth()
  const nav = useNav()
  const [dateRange, setDateRange] = useState("This week")
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="animate-slide-up">
            <h1 className="section-title mb-1">Welcome back, {user?.name.split(" ")[0]}</h1>
            <p className="text-body-text-muted">
              An at-a-glance overview of your shop today.
            </p>
          </div>
          <Button
            variant="outline"
            className="animate-slide-up"
            data-testid="date-range-selector"
          >
            Today <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* 1. Today's Summary */}
        <motion.div variants={cardVariants}>
          <Card className="group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Today's Summary</span>
                <span className="text-sm font-medium text-green-500 flex items-center">
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
        <div>
          <h2 className="section-title text-xl mb-4">Current Shifts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4">Ava – Scooper, 3h 17m</CardContent></Card>
            <Card><CardContent className="p-4">Leo – Cashier, 2h 45m</CardContent></Card>
            <Card><CardContent className="p-4">Mia – Toppings, 1h 5m</CardContent></Card>
            <Card className="border-dashed"><CardContent className="p-4 text-body-text-muted">+2 more</CardContent></Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 3. Pending Actions */}
            <div>
              <h2 className="section-title text-xl mb-4">Pending Actions</h2>
              <div className="space-y-3">
                <Card className="p-4 flex items-center justify-between"><span>Time Off: Justin Tan (Oct 28-30)</span><Button variant="outline" size="sm">Review</Button></Card>
                <Card className="p-4 flex items-center justify-between"><span>Shift Swap: Ava for Leo (Oct 29)</span><Button variant="outline" size="sm">Review</Button></Card>
              </div>
            </div>

            {/* 5. Recent Activity Feed */}
            <div>
              <h2 className="section-title text-xl mb-4">Recent Activity</h2>
              <Card>
                <CardContent>
                  <div className="space-y-2.5 pt-6">
                    <div className="group/item flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-1.5 bg-accent flex-shrink-0" />
                      <p className="text-sm text-body-text-muted">Chatcha's time-off request for Jan 25-27 was approved.</p>
                    </div>
                    <div className="group/item flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full mt-1.5 bg-mint-500 flex-shrink-0" />
                      <p className="text-sm text-body-text-muted">5 new shifts were added for next week.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            {/* 4. Quick Actions */}
            <div>
              <h2 className="section-title text-xl mb-4">Quick Actions</h2>
              <div className="flex flex-col space-y-2">
                <Button>Create Shift</Button>
                <Button variant="outline">Approve All</Button>
                <Button variant="outline">Run Payroll</Button>
              </div>
            </div>

            {/* 6. Sweet Moment */}
            <div>
              <h2 className="section-title text-xl mb-4">Sweet Moment</h2>
              <Card className="bg-mint-100 border-mint-200">
                <CardHeader>
                  <CardTitle className="text-lg">Staff of the Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-lg">🎉 Ava!</p>
                  <p className="text-sm text-body-text-muted">For amazing customer feedback.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ShiftModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </AppLayout>
  )
}

