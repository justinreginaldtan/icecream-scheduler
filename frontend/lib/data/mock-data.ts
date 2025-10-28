// Mock data for Sweet Solutions
// TODO: Replace with live data from AWS API Gateway

export interface Employee {
  id: string
  name: string
  role: string
  hoursPerWeek: number
  email?: string
  phone?: string
  availability?: string[]
}

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  date: string
  startTime: string
  endTime: string
  role: string
  status: "scheduled" | "completed" | "pending"
}

export interface TimeOffRequest {
  id: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "denied"
  submittedDate: string
}

export interface PayrollEntry {
  id: string
  employeeId: string
  employeeName: string
  role: string
  hoursWorked: number
  hourlyRate: number
  totalPay: number
  period: string
}

import { User } from "../auth/auth-context"

// TODO: Replace with live data from backend API

export const users: User[] = [
  {
    id: "user-mari",
    name: "Mari Lisa",
    email: "mari.lisa@example.com",
    role: "manager",
  },
  {
    id: "user-justin",
    name: "Justin Tan",
    email: "justin.tan@example.com",
    role: "employee",
  },
]

export const employees: Employee[] = [
  {
    id: "emp-1",
    name: "Mari Lisa",
    role: "Store Manager",
    hoursPerWeek: 40,
    email: "mari.lisa@example.com",
    phone: "(555) 123-4567",
  },
  {
    id: "emp-2",
    name: "Vidhi Patel",
    role: "Shift Lead",
    hoursPerWeek: 35,
    email: "vidhi@howdy.com",
    phone: "(555) 234-5678",
  },
  {
    id: "emp-3",
    name: "Chatcha Mantapaneewat",
    role: "Scooper",
    hoursPerWeek: 25,
    email: "chatcha@howdy.com",
    phone: "(555) 345-6789",
  },
  {
    id: "emp-4",
    name: "Natalie Tran",
    role: "Barista",
    hoursPerWeek: 28,
    email: "natalie@howdy.com",
    phone: "(555) 456-7890",
  },
  {
    id: "emp-5",
    name: "Rayan Rashid",
    role: "Cashier",
    hoursPerWeek: 30,
    email: "rayan@howdy.com",
    phone: "(555) 567-8901",
  },
  {
    id: "emp-6",
    name: "Justin Tan",
    role: "Scheduler / Developer",
    hoursPerWeek: 10,
    email: "justin.tan@example.com",
    phone: "(555) 678-9012",
  },
  {
    id: "emp-7",
    name: "James Harris",
    role: "Scooper",
    hoursPerWeek: 20,
    email: "james@howdy.com",
    phone: "(555) 789-0123",
  },
]

export const shifts: Shift[] = [
  {
    id: "shift-1",
    employeeId: "emp-1",
    employeeName: "Mari Lisa",
    date: "2025-01-20",
    startTime: "09:00",
    endTime: "17:00",
    role: "Store Manager",
    status: "scheduled",
  },
  {
    id: "shift-2",
    employeeId: "emp-2",
    employeeName: "Vidhi Patel",
    date: "2025-01-20",
    startTime: "10:00",
    endTime: "18:00",
    role: "Shift Lead",
    status: "scheduled",
  },
  {
    id: "shift-3",
    employeeId: "emp-3",
    employeeName: "Chatcha Mantapaneewat",
    date: "2025-01-20",
    startTime: "12:00",
    endTime: "17:00",
    role: "Scooper",
    status: "scheduled",
  },
  {
    id: "shift-4",
    employeeId: "emp-4",
    employeeName: "Natalie Tran",
    date: "2025-01-21",
    startTime: "11:00",
    endTime: "19:00",
    role: "Barista",
    status: "scheduled",
  },
  {
    id: "shift-5",
    employeeId: "emp-5",
    employeeName: "Rayan Rashid",
    date: "2025-01-21",
    startTime: "13:00",
    endTime: "21:00",
    role: "Cashier",
    status: "scheduled",
  },
]

export const timeOffRequests: TimeOffRequest[] = [
  {
    id: "request-1",
    employeeId: "emp-3",
    employeeName: "Chatcha Mantapaneewat",
    startDate: "2025-01-25",
    endDate: "2025-01-27",
    reason: "Family vacation",
    status: "pending",
    submittedDate: "2025-01-15",
  },
  {
    id: "request-2",
    employeeId: "emp-4",
    employeeName: "Natalie Tran",
    startDate: "2025-02-01",
    endDate: "2025-02-01",
    reason: "Doctor's appointment",
    status: "pending",
    submittedDate: "2025-01-16",
  },
  {
    id: "request-3",
    employeeId: "emp-5",
    employeeName: "Rayan Rashid",
    startDate: "2025-01-18",
    endDate: "2025-01-19",
    reason: "Personal day",
    status: "approved",
    submittedDate: "2025-01-10",
  },
]

export const payrollData: PayrollEntry[] = [
  {
    id: "payroll-1",
    employeeId: "emp-1",
    employeeName: "Mari Lisa",
    role: "Store Manager",
    hoursWorked: 160,
    hourlyRate: 25,
    totalPay: 4000,
    period: "January 2025",
  },
  {
    id: "payroll-2",
    employeeId: "emp-2",
    employeeName: "Vidhi Patel",
    role: "Shift Lead",
    hoursWorked: 140,
    hourlyRate: 18,
    totalPay: 2520,
    period: "January 2025",
  },
  {
    id: "payroll-3",
    employeeId: "emp-3",
    employeeName: "Chatcha Mantapaneewat",
    role: "Scooper",
    hoursWorked: 100,
    hourlyRate: 15,
    totalPay: 1500,
    period: "January 2025",
  },
  {
    id: "payroll-4",
    employeeId: "emp-4",
    employeeName: "Natalie Tran",
    role: "Barista",
    hoursWorked: 112,
    hourlyRate: 16,
    totalPay: 1792,
    period: "January 2025",
  },
  {
    id: "payroll-5",
    employeeId: "emp-5",
    employeeName: "Rayan Rashid",
    role: "Cashier",
    hoursWorked: 120,
    hourlyRate: 15,
    totalPay: 1800,
    period: "January 2025",
  },
  {
    id: "payroll-6",
    employeeId: "emp-6",
    employeeName: "Justin Tan",
    role: "Scheduler / Developer",
    hoursWorked: 40,
    hourlyRate: 30,
    totalPay: 1200,
    period: "January 2025",
  },
  {
    id: "payroll-7",
    employeeId: "emp-7",
    employeeName: "James Harris",
    role: "Scooper",
    hoursWorked: 80,
    hourlyRate: 15,
    totalPay: 1200,
    period: "January 2025",
  },
]
