-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- User table
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('manager', 'employee')),
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Employee table
CREATE TABLE IF NOT EXISTS Employee (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  hours_per_week DECIMAL(10,2) DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  availability JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Shift table
CREATE TABLE IF NOT EXISTS Shift (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  employee_name TEXT NOT NULL,
  shift_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  created_by_user_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES Employee(id),
  FOREIGN KEY(created_by_user_id) REFERENCES User(id)
);

-- TimeOffRequest table
CREATE TABLE IF NOT EXISTS TimeOffRequest (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  employee_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'denied')),
  submitted_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_by_user_id INTEGER,
  reviewed_date DATETIME,
  review_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES Employee(id),
  FOREIGN KEY(reviewed_by_user_id) REFERENCES User(id)
);

-- Payroll table
CREATE TABLE IF NOT EXISTS Payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  employee_name TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  hours_worked DECIMAL(10,2) NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  total_pay DECIMAL(10,2) NOT NULL,
  overtime_hours DECIMAL(10,2) DEFAULT 0,
  overtime_pay DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  net_pay DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft', 'approved', 'paid')),
  processed_by_user_id INTEGER,
  processed_date DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES Employee(id),
  FOREIGN KEY(processed_by_user_id) REFERENCES User(id)
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON User(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_email ON Employee(email);
CREATE INDEX IF NOT EXISTS idx_employee_is_active ON Employee(is_active);
CREATE INDEX IF NOT EXISTS idx_shift_employee_date ON Shift(employee_id, shift_date);
CREATE INDEX IF NOT EXISTS idx_shift_date ON Shift(shift_date);
CREATE INDEX IF NOT EXISTS idx_shift_status ON Shift(status);
CREATE INDEX IF NOT EXISTS idx_request_employee_status ON TimeOffRequest(employee_id, status);
CREATE INDEX IF NOT EXISTS idx_request_status ON TimeOffRequest(status);
CREATE INDEX IF NOT EXISTS idx_request_date_range ON TimeOffRequest(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_period ON Payroll(employee_id, period);
CREATE INDEX IF NOT EXISTS idx_payroll_period_status ON Payroll(period, status);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON Payroll(status);
