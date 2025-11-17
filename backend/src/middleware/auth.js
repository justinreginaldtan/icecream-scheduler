const jwt = require("jsonwebtoken")
const { getDatabase } = require("../database/db")

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const db = getDatabase()

    // Get user from SQLite
    const stmt = db.prepare("SELECT * FROM User WHERE id = ? AND is_active = 1")
    const user = stmt.get(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token or user not found.",
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid token.",
    })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions.",
      })
    }

    next()
  }
}

module.exports = { auth, requireRole }
