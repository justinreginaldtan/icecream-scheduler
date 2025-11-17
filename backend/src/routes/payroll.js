const express = require("express")
const { auth, requireRole } = require("../middleware/auth")
const { getDatabase } = require("../database/db")

const router = express.Router()

/**
 * Calculate hours between two times
 * Assumes times are in HH:MM format
 */
function calculateHours(startTime, endTime) {
  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  const startTotalMin = startHour * 60 + startMin
  const endTotalMin = endHour * 60 + endMin

  return (endTotalMin - startTotalMin) / 60
}

// Get payroll data (Manager only)
router.get("/", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()
    const { period } = req.query

    let query = "SELECT * FROM Payroll WHERE 1=1"
    const params = []

    if (period) {
      query += " AND period = ?"
      params.push(period)
    }

    query += " ORDER BY period DESC, employee_name ASC"

    const stmt = db.prepare(query)
    const payrollData = stmt.all(...params)

    res.json({
      success: true,
      data: payrollData,
      count: payrollData.length,
    })
  } catch (error) {
    console.error("Get payroll error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch payroll data",
    })
  }
})

// Generate payroll for period (Manager only)
router.post("/generate", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()
    const { period } = req.body // e.g., "2025-01"

    if (!period) {
      return res.status(400).json({
        success: false,
        error: "Period is required (format: YYYY-MM)",
      })
    }

    // Check if payroll already exists for this period
    const checkStmt = db.prepare("SELECT id FROM Payroll WHERE period = ? LIMIT 1")
    if (checkStmt.get(period)) {
      return res.status(400).json({
        success: false,
        error: "Payroll already exists for this period",
      })
    }

    // Get all active employees
    const empStmt = db.prepare("SELECT * FROM Employee WHERE is_active = 1")
    const employees = empStmt.all()

    // Calculate dates for period
    const [year, month] = period.split("-").map(Number)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const payrollEntries = []

    // Generate payroll for each employee
    const insertStmt = db.prepare(`
      INSERT INTO Payroll (employee_id, employee_name, role, period, hours_worked, hourly_rate, total_pay, overtime_hours, overtime_pay, net_pay, status, processed_by_user_id, processed_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)

    for (const employee of employees) {
      // Get shifts for this employee in this period
      const shiftStmt = db.prepare(`
        SELECT * FROM Shift
        WHERE employee_id = ? AND shift_date BETWEEN ? AND ? AND status = 'completed'
      `)
      const shifts = shiftStmt.all(
        employee.id,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      )

      // Calculate total hours
      let totalHours = 0
      for (const shift of shifts) {
        const hours = calculateHours(shift.start_time, shift.end_time)
        totalHours += hours
      }

      // Calculate overtime (over 40 hours per week)
      const daysDiff = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000))
      const weeksInPeriod = Math.ceil(daysDiff / 7)
      const regularHours = Math.min(totalHours, weeksInPeriod * 40)
      const overtimeHours = Math.max(0, totalHours - weeksInPeriod * 40)

      // Calculate pay
      const regularPay = regularHours * employee.hourly_rate
      const overtimePay = overtimeHours * employee.hourly_rate * 1.5
      const totalPay = regularPay + overtimePay

      const result = insertStmt.run(
        employee.id,
        employee.name,
        employee.role,
        period,
        totalHours,
        employee.hourly_rate,
        totalPay,
        overtimeHours,
        overtimePay,
        totalPay, // netPay = totalPay for now
        "draft",
        req.user.id
      )

      // Fetch created entry
      const getStmt = db.prepare("SELECT * FROM Payroll WHERE id = ?")
      const entry = getStmt.get(result.lastInsertRowid)
      payrollEntries.push(entry)
    }

    res.status(201).json({
      success: true,
      data: payrollEntries,
      message: `Payroll generated for ${period}`,
    })
  } catch (error) {
    console.error("Generate payroll error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to generate payroll",
    })
  }
})

// Export payroll as CSV (Manager only)
router.get("/export", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()
    const { period } = req.query

    let query = "SELECT * FROM Payroll WHERE 1=1"
    const params = []

    if (period) {
      query += " AND period = ?"
      params.push(period)
    }

    query += " ORDER BY period DESC, employee_name ASC"

    const stmt = db.prepare(query)
    const payrollData = stmt.all(...params)

    if (payrollData.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No payroll data found for export",
      })
    }

    // Convert to CSV
    const csvHeader =
      "Employee Name,Role,Period,Hours Worked,Hourly Rate,Total Pay,Overtime Hours,Overtime Pay,Net Pay,Status"
    const csvRows = payrollData.map((entry) =>
      [
        entry.employee_name,
        entry.role,
        entry.period,
        entry.hours_worked,
        entry.hourly_rate,
        entry.total_pay,
        entry.overtime_hours,
        entry.overtime_pay,
        entry.net_pay,
        entry.status,
      ].join(",")
    )

    const csv = [csvHeader, ...csvRows].join("\n")

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=payroll-${period || "all"}.csv`)
    res.send(csv)
  } catch (error) {
    console.error("Export payroll error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to export payroll data",
    })
  }
})

// Update payroll status (Manager only)
router.put("/:id/status", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()
    const { status } = req.body

    if (!["draft", "approved", "paid"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be draft, approved, or paid",
      })
    }

    // Check if payroll exists
    const checkStmt = db.prepare("SELECT id FROM Payroll WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Payroll entry not found",
      })
    }

    // Update status
    const updateStmt = db.prepare(`
      UPDATE Payroll
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updateStmt.run(status, req.params.id)

    // Fetch and return updated payroll
    const getStmt = db.prepare("SELECT * FROM Payroll WHERE id = ?")
    const payroll = getStmt.get(req.params.id)

    res.json({
      success: true,
      data: payroll,
      message: "Payroll status updated successfully",
    })
  } catch (error) {
    console.error("Update payroll status error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update payroll status",
    })
  }
})

module.exports = router
