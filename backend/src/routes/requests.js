const express = require("express")
const { auth, requireRole } = require("../middleware/auth")
const { validateTimeOffRequest } = require("../middleware/validation")
const { getDatabase } = require("../database/db")

const router = express.Router()

// Get all time-off requests
router.get("/", auth, (req, res) => {
  try {
    const db = getDatabase()
    const { status, employee } = req.query

    let query = "SELECT * FROM TimeOffRequest WHERE 1=1"
    const params = []

    // Filter by status
    if (status) {
      query += " AND status = ?"
      params.push(status)
    }

    // Filter by employee
    if (employee) {
      query += " AND employee_id = ?"
      params.push(employee)
    }

    // If user is employee, only show their own requests
    if (req.user.role === "employee") {
      const empStmt = db.prepare("SELECT id FROM Employee WHERE email = ?")
      const empRecord = empStmt.get(req.user.email)
      if (empRecord) {
        query += " AND employee_id = ?"
        params.push(empRecord.id)
      }
    }

    query += " ORDER BY submitted_date DESC"

    const stmt = db.prepare(query)
    const requests = stmt.all(...params)

    res.json({
      success: true,
      data: requests,
      count: requests.length,
    })
  } catch (error) {
    console.error("Get requests error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch time-off requests",
    })
  }
})

// Get request by ID
router.get("/:id", auth, (req, res) => {
  try {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM TimeOffRequest WHERE id = ?")
    const request = stmt.get(req.params.id)

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Time-off request not found",
      })
    }

    // Check if employee can view this request
    if (req.user.role === "employee") {
      const empStmt = db.prepare("SELECT id FROM Employee WHERE email = ?")
      const empRecord = empStmt.get(req.user.email)
      if (!empRecord || request.employee_id !== empRecord.id) {
        return res.status(403).json({
          success: false,
          error: "Access denied",
        })
      }
    }

    res.json({
      success: true,
      data: request,
    })
  } catch (error) {
    console.error("Get request error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch time-off request",
    })
  }
})

// Create new time-off request
router.post("/", auth, validateTimeOffRequest, (req, res) => {
  try {
    const db = getDatabase()
    const { employee_id, start_date, end_date, reason } = req.body

    // If user is employee, use their employee record
    let finalEmployeeId = employee_id
    if (req.user.role === "employee") {
      const empStmt = db.prepare("SELECT id FROM Employee WHERE email = ?")
      const empRecord = empStmt.get(req.user.email)
      if (!empRecord) {
        return res.status(404).json({
          success: false,
          error: "Employee record not found",
        })
      }
      finalEmployeeId = empRecord.id
    }

    // Verify employee exists
    const empStmt = db.prepare("SELECT id, name FROM Employee WHERE id = ?")
    const employee = empStmt.get(finalEmployeeId)

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      })
    }

    // Check for overlapping requests
    const checkStmt = db.prepare(`
      SELECT id FROM TimeOffRequest
      WHERE employee_id = ? AND status IN ('pending', 'approved')
      AND start_date <= ? AND end_date >= ?
    `)
    if (checkStmt.get(finalEmployeeId, end_date, start_date)) {
      return res.status(400).json({
        success: false,
        error: "Time-off request overlaps with existing request",
      })
    }

    // Create request
    const insertStmt = db.prepare(`
      INSERT INTO TimeOffRequest (employee_id, employee_name, start_date, end_date, reason, status, submitted_date)
      VALUES (?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `)

    const result = insertStmt.run(finalEmployeeId, employee.name, start_date, end_date, reason)

    // Fetch and return created request
    const getStmt = db.prepare("SELECT * FROM TimeOffRequest WHERE id = ?")
    const request = getStmt.get(result.lastInsertRowid)

    res.status(201).json({
      success: true,
      data: request,
      message: "Time-off request submitted successfully",
    })
  } catch (error) {
    console.error("Create request error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create time-off request",
    })
  }
})

// Approve request (Manager only)
router.put("/:id/approve", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()
    const { review_notes } = req.body

    // Check if request exists
    const checkStmt = db.prepare("SELECT id FROM TimeOffRequest WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Time-off request not found",
      })
    }

    // Update request
    const updateStmt = db.prepare(`
      UPDATE TimeOffRequest
      SET status = 'approved', reviewed_by_user_id = ?, reviewed_date = CURRENT_TIMESTAMP, review_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updateStmt.run(req.user.id, review_notes || null, req.params.id)

    // Fetch and return updated request
    const getStmt = db.prepare("SELECT * FROM TimeOffRequest WHERE id = ?")
    const request = getStmt.get(req.params.id)

    res.json({
      success: true,
      data: request,
      message: "Time-off request approved successfully",
    })
  } catch (error) {
    console.error("Approve request error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to approve time-off request",
    })
  }
})

// Deny request (Manager only)
router.put("/:id/deny", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()
    const { review_notes } = req.body

    // Check if request exists
    const checkStmt = db.prepare("SELECT id FROM TimeOffRequest WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Time-off request not found",
      })
    }

    // Update request
    const updateStmt = db.prepare(`
      UPDATE TimeOffRequest
      SET status = 'denied', reviewed_by_user_id = ?, reviewed_date = CURRENT_TIMESTAMP, review_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updateStmt.run(req.user.id, review_notes || null, req.params.id)

    // Fetch and return updated request
    const getStmt = db.prepare("SELECT * FROM TimeOffRequest WHERE id = ?")
    const request = getStmt.get(req.params.id)

    res.json({
      success: true,
      data: request,
      message: "Time-off request denied",
    })
  } catch (error) {
    console.error("Deny request error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to deny time-off request",
    })
  }
})

module.exports = router
