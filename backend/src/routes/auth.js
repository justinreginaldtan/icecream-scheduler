const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { auth } = require("../middleware/auth")
const { validateLogin } = require("../middleware/validation")
const { getDatabase } = require("../database/db")
const dbUtils = require("../utils/db-utils")

const router = express.Router()

// Login
router.post("/login", validateLogin, (req, res) => {
  try {
    const { email, password } = req.body
    const db = getDatabase()

    // Find user by email
    const stmt = db.prepare("SELECT * FROM User WHERE email = ? AND is_active = 1")
    const user = stmt.get(email.toLowerCase())

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      })
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      })
    }

    // Update last login
    const updateStmt = db.prepare("UPDATE User SET last_login = CURRENT_TIMESTAMP WHERE id = ?")
    updateStmt.run(user.id)

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    )

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get current user
router.get("/me", auth, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          lastLogin: req.user.last_login,
        },
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Logout (client-side token removal)
router.post("/logout", auth, (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  })
})

module.exports = router
