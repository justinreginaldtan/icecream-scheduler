const Database = require("better-sqlite3")
const fs = require("fs")
const path = require("path")
const os = require("os")
const bcrypt = require("bcryptjs")

let db = null

/**
 * Initialize SQLite database
 * Creates database file if it doesn't exist
 * Runs initialization SQL to create tables
 * Seeds with demo data on first run
 */
function initializeDatabase() {
  // Determine database path
  const dbDir = process.env.DATABASE_PATH || path.join(os.homedir(), ".sweet-solutions")
  const dbPath = path.join(dbDir, "app.db")

  // Create directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
    console.log(`📁 Created database directory: ${dbDir}`)
  }

  // Check if this is first run (database doesn't exist yet)
  const isFirstRun = !fs.existsSync(dbPath)

  // Open/create database
  try {
    db = new Database(dbPath)
    db.pragma("journal_mode = WAL") // Write-Ahead Logging for better concurrency
    console.log(`✅ Database connected: ${dbPath}`)

    if (isFirstRun) {
      console.log("🌱 First run detected. Initializing schema...")
      const initSQL = fs.readFileSync(path.join(__dirname, "init.sql"), "utf-8")
      db.exec(initSQL)
      console.log("✅ Database schema created")

      // Seed with demo data
      seedDatabase()
      console.log("✅ Demo data seeded")
    }

    return db
  } catch (error) {
    console.error("❌ Failed to initialize database:", error)
    throw error
  }
}

/**
 * Seed database with demo/mock data
 * Called only on first run
 */
function seedDatabase() {
  if (!db) return

  try {
    // Create admin user
    const adminPassword = bcrypt.hashSync("demo123", 10)
    const adminStmt = db.prepare(`
      INSERT INTO User (email, password_hash, name, role, is_active)
      VALUES (?, ?, ?, ?, ?)
    `)
    const adminResult = adminStmt.run("mari.lisa@example.com", adminPassword, "Mari Lisa", "manager", 1)
    const adminUserId = adminResult.lastInsertRowid

    // Create employees
    const employees = [
      { name: "Mari Lisa", email: "mari.lisa@example.com", phone: "(555) 123-4567", role: "Store Manager", hourlyRate: 25.0, hoursPerWeek: 40 },
      { name: "Vidhi Patel", email: "vidhi@howdy.com", phone: "(555) 234-5678", role: "Shift Lead", hourlyRate: 18.0, hoursPerWeek: 35 },
      { name: "Chatcha Mantapaneewat", email: "chatcha@howdy.com", phone: "(555) 345-6789", role: "Scooper", hourlyRate: 15.0, hoursPerWeek: 25 },
      { name: "Natalie Tran", email: "natalie@howdy.com", phone: "(555) 456-7890", role: "Barista", hourlyRate: 16.0, hoursPerWeek: 28 },
      { name: "Rayan Rashid", email: "rayan@howdy.com", phone: "(555) 567-8901", role: "Cashier", hourlyRate: 15.0, hoursPerWeek: 30 },
      { name: "Justin Tan", email: "justin.tan@example.com", phone: "(555) 678-9012", role: "Scheduler / Developer", hourlyRate: 30.0, hoursPerWeek: 10 },
      { name: "James Harris", email: "james@howdy.com", phone: "(555) 789-0123", role: "Scooper", hourlyRate: 15.0, hoursPerWeek: 20 },
    ]

    const employeeStmt = db.prepare(`
      INSERT INTO Employee (name, email, phone, role, hourly_rate, hours_per_week, is_active, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const employeeIds = {}
    employees.forEach((emp) => {
      const result = employeeStmt.run(
        emp.name,
        emp.email,
        emp.phone,
        emp.role,
        emp.hourlyRate,
        emp.hoursPerWeek,
        1,
        new Date().toISOString().split("T")[0]
      )
      employeeIds[emp.name] = result.lastInsertRowid
    })

    // Create shifts
    const shifts = [
      {
        employeeName: "Mari Lisa",
        date: "2025-01-20",
        startTime: "09:00",
        endTime: "17:00",
        role: "Store Manager",
        status: "scheduled",
      },
      {
        employeeName: "Vidhi Patel",
        date: "2025-01-20",
        startTime: "10:00",
        endTime: "18:00",
        role: "Shift Lead",
        status: "scheduled",
      },
      {
        employeeName: "Chatcha Mantapaneewat",
        date: "2025-01-20",
        startTime: "12:00",
        endTime: "17:00",
        role: "Scooper",
        status: "scheduled",
      },
      {
        employeeName: "Natalie Tran",
        date: "2025-01-21",
        startTime: "11:00",
        endTime: "19:00",
        role: "Barista",
        status: "scheduled",
      },
      {
        employeeName: "Rayan Rashid",
        date: "2025-01-21",
        startTime: "13:00",
        endTime: "21:00",
        role: "Cashier",
        status: "scheduled",
      },
    ]

    const shiftStmt = db.prepare(`
      INSERT INTO Shift (employee_id, employee_name, shift_date, start_time, end_time, role, status, created_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    shifts.forEach((shift) => {
      const empId = employeeIds[shift.employeeName]
      if (empId) {
        shiftStmt.run(
          empId,
          shift.employeeName,
          shift.date,
          shift.startTime,
          shift.endTime,
          shift.role,
          shift.status,
          adminUserId
        )
      }
    })

    // Create time-off requests
    const requests = [
      {
        employeeName: "Chatcha Mantapaneewat",
        startDate: "2025-01-25",
        endDate: "2025-01-27",
        reason: "Family vacation",
        status: "pending",
      },
      {
        employeeName: "Natalie Tran",
        startDate: "2025-02-01",
        endDate: "2025-02-01",
        reason: "Doctor's appointment",
        status: "pending",
      },
      {
        employeeName: "Rayan Rashid",
        startDate: "2025-01-18",
        endDate: "2025-01-19",
        reason: "Personal day",
        status: "approved",
      },
    ]

    const requestStmt = db.prepare(`
      INSERT INTO TimeOffRequest (employee_id, employee_name, start_date, end_date, reason, status, submitted_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    requests.forEach((req) => {
      const empId = employeeIds[req.employeeName]
      if (empId) {
        requestStmt.run(
          empId,
          req.employeeName,
          req.startDate,
          req.endDate,
          req.reason,
          req.status,
          new Date().toISOString()
        )
      }
    })

    // Create payroll entries
    const payroll = [
      { employeeName: "Mari Lisa", role: "Store Manager", period: "2025-01", hoursWorked: 160, hourlyRate: 25.0, totalPay: 4000.0 },
      { employeeName: "Vidhi Patel", role: "Shift Lead", period: "2025-01", hoursWorked: 140, hourlyRate: 18.0, totalPay: 2520.0 },
      { employeeName: "Chatcha Mantapaneewat", role: "Scooper", period: "2025-01", hoursWorked: 100, hourlyRate: 15.0, totalPay: 1500.0 },
      { employeeName: "Natalie Tran", role: "Barista", period: "2025-01", hoursWorked: 112, hourlyRate: 16.0, totalPay: 1792.0 },
      { employeeName: "Rayan Rashid", role: "Cashier", period: "2025-01", hoursWorked: 120, hourlyRate: 15.0, totalPay: 1800.0 },
      { employeeName: "Justin Tan", role: "Scheduler / Developer", period: "2025-01", hoursWorked: 40, hourlyRate: 30.0, totalPay: 1200.0 },
      { employeeName: "James Harris", role: "Scooper", period: "2025-01", hoursWorked: 80, hourlyRate: 15.0, totalPay: 1200.0 },
    ]

    const payrollStmt = db.prepare(`
      INSERT INTO Payroll (employee_id, employee_name, role, period, hours_worked, hourly_rate, total_pay, net_pay, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    payroll.forEach((entry) => {
      const empId = employeeIds[entry.employeeName]
      if (empId) {
        payrollStmt.run(
          empId,
          entry.employeeName,
          entry.role,
          entry.period,
          entry.hoursWorked,
          entry.hourlyRate,
          entry.totalPay,
          entry.totalPay, // net_pay = total_pay for now (no deductions)
          "draft"
        )
      }
    })

    console.log(`✅ Seeded database with admin user and demo data`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

/**
 * Get database connection
 * Initialize if not already initialized
 */
function getDatabase() {
  if (!db) {
    initializeDatabase()
  }
  return db
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    db.close()
    console.log("🔌 Database connection closed")
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
}
