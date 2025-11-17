# DATABASE_SCHEMA.md

SQLite database schema for Sweet Solutions. All tables, fields, types, and relationships defined here.

---

## Overview

**Database File**: `~/.sweet-solutions/app.db` (configurable location)

**Tables**: 5 core tables (User, Employee, Shift, TimeOffRequest, Payroll)

**Driver**: `better-sqlite3` (synchronous SQLite driver for Node.js)

**Why SQLite**:
- Single file database
- No server setup
- Perfect for local app
- Easy backups (just copy the file)

---

## Table Definitions

### 1. User

Stores login credentials and admin account information.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique user ID |
| email | TEXT | NOT NULL, UNIQUE | Login email (lowercase) |
| password_hash | TEXT | NOT NULL | Hashed with bcrypt (10 rounds) |
| name | TEXT | NOT NULL | Full name |
| role | TEXT | NOT NULL | Enum: 'manager' \| 'employee' |
| is_active | INTEGER | NOT NULL, DEFAULT 1 | Boolean (1 = true, 0 = false) |
| last_login | DATETIME | NULL | Timestamp of last login |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update time |

**Sample Data**:
```sql
INSERT INTO User (email, password_hash, name, role, is_active)
VALUES ('mari.lisa@example.com', '[bcrypt hash]', 'Mari Lisa', 'manager', 1);
```

**Indexes**:
- `CREATE UNIQUE INDEX idx_user_email ON User(email);`

---

### 2. Employee

Stores employee information.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique employee ID |
| name | TEXT | NOT NULL | Full name |
| email | TEXT | NOT NULL, UNIQUE | Work email |
| phone | TEXT | NULL | Phone number |
| role | TEXT | NOT NULL | Job role (e.g., "Scooper", "Barista", "Cashier") |
| hourly_rate | DECIMAL(10,2) | NOT NULL | Base hourly wage |
| hours_per_week | DECIMAL(10,2) | DEFAULT 0 | Expected hours per week |
| is_active | INTEGER | NOT NULL, DEFAULT 1 | Boolean |
| hire_date | DATE | NOT NULL, DEFAULT CURRENT_DATE | When employee hired |
| availability | JSON | NULL | JSON array of availability (see below) |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Availability JSON Structure**:
```json
[
  {
    "day": "monday",
    "startTime": "09:00",
    "endTime": "17:00"
  },
  {
    "day": "tuesday",
    "startTime": "09:00",
    "endTime": "17:00"
  }
]
```

**Sample Data**:
```sql
INSERT INTO Employee (name, email, phone, role, hourly_rate, hours_per_week, hire_date)
VALUES ('Mari Lisa', 'mari.lisa@example.com', '(555) 123-4567', 'Store Manager', 25.00, 40, '2024-01-15');
```

**Indexes**:
- `CREATE UNIQUE INDEX idx_employee_email ON Employee(email);`
- `CREATE INDEX idx_employee_is_active ON Employee(is_active);`

---

### 3. Shift

Stores scheduled shifts for employees.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique shift ID |
| employee_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to Employee |
| employee_name | TEXT | NOT NULL | Denormalized for quick access |
| shift_date | DATE | NOT NULL | Date of shift |
| start_time | TEXT | NOT NULL | Format: HH:MM (e.g., "09:00") |
| end_time | TEXT | NOT NULL | Format: HH:MM (e.g., "17:00") |
| role | TEXT | NOT NULL | Job role during shift |
| status | TEXT | NOT NULL | Enum: 'scheduled' \| 'completed' \| 'cancelled' \| 'no-show' |
| notes | TEXT | NULL | Additional notes |
| created_by_user_id | INTEGER | NOT NULL, FOREIGN KEY | User who created shift |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When shift was created |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Sample Data**:
```sql
INSERT INTO Shift (employee_id, employee_name, shift_date, start_time, end_time, role, status, created_by_user_id)
VALUES (1, 'Mari Lisa', '2025-01-20', '09:00', '17:00', 'Store Manager', 'scheduled', 1);
```

**Indexes**:
- `CREATE INDEX idx_shift_employee_date ON Shift(employee_id, shift_date);`
- `CREATE INDEX idx_shift_date ON Shift(shift_date);`
- `CREATE INDEX idx_shift_status ON Shift(status);`

**Foreign Keys**:
```sql
FOREIGN KEY(employee_id) REFERENCES Employee(id)
FOREIGN KEY(created_by_user_id) REFERENCES User(id)
```

---

### 4. TimeOffRequest

Stores time-off request submissions and approvals.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique request ID |
| employee_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to Employee |
| employee_name | TEXT | NOT NULL | Denormalized for quick access |
| start_date | DATE | NOT NULL | First day off |
| end_date | DATE | NOT NULL | Last day off |
| reason | TEXT | NOT NULL | Reason for time off |
| status | TEXT | NOT NULL | Enum: 'pending' \| 'approved' \| 'denied' |
| submitted_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When request submitted |
| reviewed_by_user_id | INTEGER | NULL, FOREIGN KEY | User who approved/denied |
| reviewed_date | DATETIME | NULL | When reviewed |
| review_notes | TEXT | NULL | Notes from manager |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Sample Data**:
```sql
INSERT INTO TimeOffRequest (employee_id, employee_name, start_date, end_date, reason, status)
VALUES (3, 'Chatcha Mantapaneewat', '2025-01-25', '2025-01-27', 'Family vacation', 'pending');
```

**Indexes**:
- `CREATE INDEX idx_request_employee_status ON TimeOffRequest(employee_id, status);`
- `CREATE INDEX idx_request_status ON TimeOffRequest(status);`
- `CREATE INDEX idx_request_date_range ON TimeOffRequest(start_date, end_date);`

**Foreign Keys**:
```sql
FOREIGN KEY(employee_id) REFERENCES Employee(id)
FOREIGN KEY(reviewed_by_user_id) REFERENCES User(id)
```

---

### 5. Payroll

Stores calculated payroll records.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique payroll ID |
| employee_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to Employee |
| employee_name | TEXT | NOT NULL | Denormalized for quick access |
| role | TEXT | NOT NULL | Job role during period |
| period | TEXT | NOT NULL | Format: "YYYY-MM" (e.g., "2025-01") |
| hours_worked | DECIMAL(10,2) | NOT NULL | Total hours in period |
| hourly_rate | DECIMAL(10,2) | NOT NULL | Rate per hour (snapshot) |
| total_pay | DECIMAL(10,2) | NOT NULL | Regular pay (hours * rate) |
| overtime_hours | DECIMAL(10,2) | DEFAULT 0 | Hours over 40/week (future use) |
| overtime_pay | DECIMAL(10,2) | DEFAULT 0 | Overtime pay (future use) |
| deductions | DECIMAL(10,2) | DEFAULT 0 | Tax/deductions (future use) |
| net_pay | DECIMAL(10,2) | NOT NULL | Final pay (total - deductions) |
| status | TEXT | NOT NULL | Enum: 'draft' \| 'approved' \| 'paid' |
| processed_by_user_id | INTEGER | NULL, FOREIGN KEY | User who processed payroll |
| processed_date | DATETIME | NULL | When payroll was processed |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Sample Data**:
```sql
INSERT INTO Payroll (employee_id, employee_name, role, period, hours_worked, hourly_rate, total_pay, net_pay, status)
VALUES (1, 'Mari Lisa', 'Store Manager', '2025-01', 160, 25.00, 4000.00, 4000.00, 'draft');
```

**Indexes**:
- `CREATE INDEX idx_payroll_employee_period ON Payroll(employee_id, period);`
- `CREATE INDEX idx_payroll_period_status ON Payroll(period, status);`
- `CREATE INDEX idx_payroll_status ON Payroll(status);`

**Foreign Keys**:
```sql
FOREIGN KEY(employee_id) REFERENCES Employee(id)
FOREIGN KEY(processed_by_user_id) REFERENCES User(id)
```

---

## Relationships (Entity Relationship Diagram)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ name            │
│ role            │
│ is_active       │
│ last_login      │
│ timestamps      │
└────────┬────────┘
         │
         │ 1:N (creates)
         │
    ┌────▼──────────────┐
    │     Shift         │
    ├───────────────────┤
    │ id (PK)           │
    │ employee_id (FK)  │
    │ created_by (FK)   │
    │ shift_date        │
    │ start_time        │
    │ end_time          │
    │ status            │
    │ timestamps        │
    └────────┬──────────┘
             │
             │ N:1 (references)
             │
    ┌────────▼────────────┐
    │    Employee         │
    ├─────────────────────┤
    │ id (PK)             │
    │ name                │
    │ email (UNIQUE)      │
    │ phone               │
    │ role                │
    │ hourly_rate         │
    │ hours_per_week      │
    │ is_active           │
    │ hire_date           │
    │ availability (JSON) │
    │ timestamps          │
    └────────┬────────────┘
             │
             │ 1:N (has)
             │
    ┌────────┴─────────────────┬────────────────────┐
    │                          │                    │
    │ (has requests)           │ (has payroll)      │
    │                          │                    │
┌───▼─────────────────┐  ┌────▼──────────────┐
│ TimeOffRequest      │  │    Payroll        │
├─────────────────────┤  ├───────────────────┤
│ id (PK)             │  │ id (PK)           │
│ employee_id (FK)    │  │ employee_id (FK)  │
│ start_date          │  │ period (YYYY-MM)  │
│ end_date            │  │ hours_worked      │
│ reason              │  │ hourly_rate       │
│ status              │  │ total_pay         │
│ reviewed_by (FK)    │  │ net_pay           │
│ review_notes        │  │ status            │
│ timestamps          │  │ processed_by (FK) │
└─────────────────────┘  │ timestamps        │
                         └───────────────────┘
```

---

## Data Migration Plan

### From Mock Data → SQLite

**Current Mock Data Source**: `frontend/lib/data/mock-data.ts`

**Migration Steps**:

1. **Extract Mock Data**: Read mock-data.ts to get hardcoded values
2. **Create Default Admin**: Convert to User record
3. **Create Employees**: Insert 7 employees from mock data
4. **Create Shifts**: Insert 5 shifts from mock data
5. **Create Time-Off Requests**: Insert 3 requests from mock data
6. **Create Payroll**: Insert 7 payroll entries from mock data

**Script Location**: `backend/src/scripts/seed-initial-data.js`

---

## SQL Initialization Script

See `backend/src/database/init.sql` for the complete CREATE TABLE statements.

```sql
-- Enable foreign keys (SQLite)
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

-- Indexes
CREATE UNIQUE INDEX idx_user_email ON User(email);
CREATE UNIQUE INDEX idx_employee_email ON Employee(email);
CREATE INDEX idx_employee_is_active ON Employee(is_active);
CREATE INDEX idx_shift_employee_date ON Shift(employee_id, shift_date);
CREATE INDEX idx_shift_date ON Shift(shift_date);
CREATE INDEX idx_shift_status ON Shift(status);
CREATE INDEX idx_request_employee_status ON TimeOffRequest(employee_id, status);
CREATE INDEX idx_request_status ON TimeOffRequest(status);
CREATE INDEX idx_request_date_range ON TimeOffRequest(start_date, end_date);
CREATE INDEX idx_payroll_employee_period ON Payroll(employee_id, period);
CREATE INDEX idx_payroll_period_status ON Payroll(period, status);
CREATE INDEX idx_payroll_status ON Payroll(status);
```

---

## Data Types & Constraints Rationale

| Decision | Why |
|----------|-----|
| **INTEGER for IDs** | SQLite native type, fast indexing |
| **TEXT for emails** | Store as-is, validate in app |
| **DECIMAL for money** | Avoid floating-point errors (e.g., 19.99 * 2 = 39.98, not 39.980000000001) |
| **JSON for availability** | Flexible, no need for separate table |
| **ISO 8601 dates** | Standard, sortable string format |
| **Denormalized employee_name in Shift/Payroll** | Avoid N+1 queries in reports |
| **CHECK constraints** | Database enforces enum values |
| **Foreign keys** | Ensure referential integrity |

---

## Future Migrations (Not for MVP)

1. **Shift Swaps Table**: When shift swap feature is built
2. **Audit Log Table**: Track all changes (who changed what, when)
3. **Overtime Rules**: Configurable overtime thresholds per employee
4. **Tax Deductions**: Different tax rates per employee
5. **Multi-location Support**: Location ID on all tables (major refactor)

---

## Revision History

**Version 1.0** - November 2025
- Initial schema for MVP
- 5 core tables (User, Employee, Shift, TimeOffRequest, Payroll)
- Optimized for single-location ice cream shop
