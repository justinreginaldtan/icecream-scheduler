const { body, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    })
  }
  next()
}

// Auth validation
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
]

// Employee validation (supports both camelCase and snake_case)
const validateEmployee = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("hourlyRate", "hourly_rate")
    .if((value, { req }) => req.body.hourlyRate || req.body.hourly_rate)
    .custom((value, { req }) => {
      const rate = req.body.hourlyRate || req.body.hourly_rate
      if (typeof rate !== "number" || rate < 0) {
        throw new Error("Hourly rate must be a positive number")
      }
      return true
    }),
  handleValidationErrors,
]

// Shift validation (supports both camelCase and snake_case, and Mongo IDs or numeric IDs)
const validateShift = [
  body("employee_id", "employee")
    .if((value, { req }) => req.body.employee_id || req.body.employee)
    .isNumeric()
    .withMessage("Valid employee ID is required"),
  body("shift_date", "date")
    .if((value, { req }) => req.body.shift_date || req.body.date)
    .isISO8601()
    .withMessage("Valid date is required"),
  body("start_time", "startTime")
    .if((value, { req }) => req.body.start_time || req.body.startTime)
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  body("end_time", "endTime")
    .if((value, { req }) => req.body.end_time || req.body.endTime)
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  handleValidationErrors,
]

// Time-off request validation (supports both camelCase and snake_case)
const validateTimeOffRequest = [
  body("employee_id", "employee")
    .if((value, { req }) => req.body.employee_id || req.body.employee)
    .isNumeric()
    .withMessage("Valid employee ID is required"),
  body("start_date", "startDate")
    .if((value, { req }) => req.body.start_date || req.body.startDate)
    .isISO8601()
    .withMessage("Valid start date is required"),
  body("end_date", "endDate")
    .if((value, { req }) => req.body.end_date || req.body.endDate)
    .isISO8601()
    .withMessage("Valid end date is required"),
  body("reason")
    .if((value) => value)
    .trim()
    .isLength({ min: 5 })
    .withMessage("Reason must be at least 5 characters long"),
  handleValidationErrors,
]

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateEmployee,
  validateShift,
  validateTimeOffRequest,
}
