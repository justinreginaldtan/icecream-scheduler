const express = require("express")
const { auth, requireRole } = require("../middleware/auth")
const { validateEmployee } = require("../middleware/validation")
const { getDatabase } = require("../database/db")

const router = express.Router()

// Get all employees
router.get("/", auth, (req, res) => {
  try {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM Employee WHERE is_active = 1 ORDER BY name ASC")
    const employees = stmt.all()

    res.json({
      success: true,
      data: employees,
      count: employees.length,
    })
  } catch (error) {
    console.error("Get employees error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch employees",
    })
  }
})

// Get employee by ID
router.get("/:id", auth, (req, res) => {
  try {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM Employee WHERE id = ?")
    const employee = stmt.get(req.params.id)

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      })
    }

    res.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error("Get employee error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch employee",
    })
  }
})

// Create new employee (Manager only)
router.post("/", auth, requireRole(["manager"]), validateEmployee, (req, res) => {
  try {
    const db = getDatabase()
    const { name, email, phone, role, hourly_rate, hours_per_week, availability } = req.body

    // Check if email already exists
    const existingStmt = db.prepare("SELECT id FROM Employee WHERE email = ?")
    if (existingStmt.get(email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "Employee with this email already exists",
      })
    }

    // Insert new employee
    const insertStmt = db.prepare(`
      INSERT INTO Employee (name, email, phone, role, hourly_rate, hours_per_week, is_active, hire_date, availability)
      VALUES (?, ?, ?, ?, ?, ?, 1, DATE('now'), ?)
    `)

    const result = insertStmt.run(
      name,
      email.toLowerCase(),
      phone || null,
      role,
      hourly_rate || 0,
      hours_per_week || 0,
      availability ? JSON.stringify(availability) : null
    )

    // Fetch and return the created employee
    const getStmt = db.prepare("SELECT * FROM Employee WHERE id = ?")
    const employee = getStmt.get(result.lastInsertRowid)

    res.status(201).json({
      success: true,
      data: employee,
      message: "Employee created successfully",
    })
  } catch (error) {
    console.error("Create employee error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create employee",
    })
  }
})

// Update employee (Manager only)
router.put("/:id", auth, requireRole(["manager"]), validateEmployee, (req, res) => {
  try {
    const db = getDatabase()
    const { name, email, phone, role, hourly_rate, hours_per_week, availability } = req.body

    // Check if employee exists
    const checkStmt = db.prepare("SELECT id FROM Employee WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      })
    }

    // Update employee
    const updateStmt = db.prepare(`
      UPDATE Employee
      SET name = ?, email = ?, phone = ?, role = ?, hourly_rate = ?, hours_per_week = ?, availability = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updateStmt.run(
      name,
      email.toLowerCase(),
      phone || null,
      role,
      hourly_rate || 0,
      hours_per_week || 0,
      availability ? JSON.stringify(availability) : null,
      req.params.id
    )

    // Fetch and return the updated employee
    const getStmt = db.prepare("SELECT * FROM Employee WHERE id = ?")
    const employee = getStmt.get(req.params.id)

    res.json({
      success: true,
      data: employee,
      message: "Employee updated successfully",
    })
  } catch (error) {
    console.error("Update employee error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update employee",
    })
  }
})

// Delete employee (Manager only) - Soft delete
router.delete("/:id", auth, requireRole(["manager"]), (req, res) => {
  try {
    const db = getDatabase()

    // Check if employee exists
    const checkStmt = db.prepare("SELECT id FROM Employee WHERE id = ?")
    if (!checkStmt.get(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      })
    }

    // Soft delete (set is_active = 0)
    const deleteStmt = db.prepare("UPDATE Employee SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    deleteStmt.run(req.params.id)

    res.json({
      success: true,
      message: "Employee deactivated successfully",
    })
  } catch (error) {
    console.error("Delete employee error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete employee",
    })
  }
})

module.exports = router
