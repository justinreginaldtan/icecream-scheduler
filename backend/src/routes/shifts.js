const express = require("express")
const { auth } = require("../middleware/auth")
const { validateShift } = require("../middleware/validation")
const { getDatabase } = require("../database/db")

const router = express.Router()

/**
 * Helper function to check for overlapping shifts
 * Checks if there's a shift that overlaps with the given time range
 */
function hasOverlappingShift(db, employeeId, date, startTime, endTime, excludeShiftId = null) {
  let query = `
    SELECT id FROM Shift
    WHERE employee_id = ? AND shift_date = ?
    AND start_time < ? AND end_time > ?
  `
  const params = [employeeId, date, endTime, startTime]

  if (excludeShiftId) {
    query += " AND id != ?"
    params.push(excludeShiftId)
  }

  const stmt = db.prepare(query)
  return stmt.get(...params) !== undefined
}

// Get all shifts with optional filters
router.get("/", auth, (req, res) => {
  try {
    const db = getDatabase()
    const { startDate, endDate, employee } = req.query

    let query = "SELECT * FROM Shift WHERE 1=1"
    const params = []

    // Filter by date range
    if (startDate && endDate) {
      query += " AND shift_date BETWEEN ? AND ?"
      params.push(startDate, endDate)
    }

    // Filter by employee
    if (employee) {
      query += " AND employee_id = ?"
      params.push(employee)
    }

    query += " ORDER BY shift_date ASC, start_time ASC"

    const stmt = db.prepare(query)
    const shifts = stmt.all(...params)

    res.json({
      success: true,
      data: shifts,
      count: shifts.length,
    })
  } catch (error) {
    console.error("Get shifts error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch shifts",
    })
  }
})

// Get shift by ID
router.get("/:id", auth, (req, res) => {
  try {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM Shift WHERE id = ?")
    const shift = stmt.get(req.params.id)

    if (!shift) {
      return res.status(404).json({
        success: false,
        error: "Shift not found",
      })
    }

    res.json({
      success: true,
      data: shift,
    })
  } catch (error) {
    console.error("Get shift error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch shift",
    })
  }
})

// Create new shift
router.post("/", auth, validateShift, (req, res) => {
  try {
    const db = getDatabase()
    const { employee_id, shift_date, start_time, end_time, role, status, notes } = req.body

    // Verify employee exists and get name
    const empStmt = db.prepare("SELECT id, name FROM Employee WHERE id = ?")
    const employee = empStmt.get(employee_id)

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      })
    }

    // Check for overlapping shifts
    if (hasOverlappingShift(db, employee_id, shift_date, start_time, end_time)) {
      return res.status(400).json({
        success: false,
        error: "Shift overlaps with existing shift",
      })
    }

    // Create shift
    const insertStmt = db.prepare(`
      INSERT INTO Shift (employee_id, employee_name, shift_date, start_time, end_time, role, status, notes, created_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertStmt.run(
      employee_id,
      employee.name,
      shift_date,
      start_time,
      end_time,
      role || "Staff",
      status || "scheduled",
      notes || null,
      req.user.id
    )

    // Fetch and return created shift
    const getStmt = db.prepare("SELECT * FROM Shift WHERE id = ?")
    const shift = getStmt.get(result.lastInsertRowid)

    res.status(201).json({
      success: true,
      data: shift,
      message: "Shift created successfully",
    })
  } catch (error) {
    console.error("Create shift error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create shift",
    })
  }
})

// Update shift
router.put("/:id", auth, validateShift, (req, res) => {
  try {
    const db = getDatabase()
    const { employee_id, shift_date, start_time, end_time, role, status, notes } = req.body

    // Check if shift exists
    const checkStmt = db.prepare("SELECT id FROM Shift WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Shift not found",
      })
    }

    // Verify employee exists and get name
    const empStmt = db.prepare("SELECT id, name FROM Employee WHERE id = ?")
    const employee = empStmt.get(employee_id)

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      })
    }

    // Check for overlapping shifts (excluding current shift)
    if (hasOverlappingShift(db, employee_id, shift_date, start_time, end_time, req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Shift overlaps with existing shift",
      })
    }

    // Update shift
    const updateStmt = db.prepare(`
      UPDATE Shift
      SET employee_id = ?, employee_name = ?, shift_date = ?, start_time = ?, end_time = ?, role = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updateStmt.run(
      employee_id,
      employee.name,
      shift_date,
      start_time,
      end_time,
      role || "Staff",
      status || "scheduled",
      notes || null,
      req.params.id
    )

    // Fetch and return updated shift
    const getStmt = db.prepare("SELECT * FROM Shift WHERE id = ?")
    const shift = getStmt.get(req.params.id)

    res.json({
      success: true,
      data: shift,
      message: "Shift updated successfully",
    })
  } catch (error) {
    console.error("Update shift error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update shift",
    })
  }
})

// Delete shift
router.delete("/:id", auth, (req, res) => {
  try {
    const db = getDatabase()

    // Check if shift exists
    const checkStmt = db.prepare("SELECT id FROM Shift WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Shift not found",
      })
    }

    // Delete shift
    const deleteStmt = db.prepare("DELETE FROM Shift WHERE id = ?")
    deleteStmt.run(req.params.id)

    res.json({
      success: true,
      message: "Shift deleted successfully",
    })
  } catch (error) {
    console.error("Delete shift error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete shift",
    })
  }
})

module.exports = router
