import { employees, shifts, timeOffRequests, users, payrollData, type Shift, type TimeOffRequest, type PayrollEntry } from "../data/mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiResponse<T = any> {
  success: boolean
  data?: T & { token?: string; user?: any }
  error?: string
  message?: string
  count?: number
}

class ApiClient {
  private baseURL: string
  private token: string | null = null
  private mockEmployees = [...employees]
  private mockShifts: Shift[] = [...shifts]
  private mockTimeOffRequests: TimeOffRequest[] = [...timeOffRequests]
  private mockPayroll: PayrollEntry[] = [...payrollData]

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  }

  private getMockData(endpoint: string, method: string, options: RequestInit = {}): ApiResponse {
    // Mock login data
    if (endpoint === '/api/auth/login' && method === 'POST') {
      const { email } = JSON.parse(options.body as string);
      const user = users.find(u => u.email === email);
      if (user) {
        return {
          success: true,
          data: {
            token: 'mock-jwt-token',
            user
          }
        }
      }
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    // Mock get current user data
    if (endpoint === '/api/auth/me' && method === 'GET') {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
      if (!storedToken) {
        return {
          success: false,
          error: 'Invalid token or user not found.'
        }
      }
      const user = users.find(u => u.id === '1'); //Hacky way to get a user
      return {
        success: true,
        data: {
          user
        }
      }
    }

    if (endpoint === '/api/employees' && method === 'GET') {
      return {
        success: true,
        data: this.mockEmployees.map((employee) => ({ ...employee })),
        count: this.mockEmployees.length
      }
    }

    if (endpoint === '/api/shifts' && method === 'GET') {
      return {
        success: true,
        data: this.mockShifts.map((shift) => ({ ...shift })),
        count: this.mockShifts.length
      }
    }

    if (endpoint.startsWith('/api/shifts') && method === 'POST') {
      const partialShift = JSON.parse(options.body as string);
      const newShift: Shift = {
        ...partialShift,
        id: `shift-${Date.now()}`,
        status: partialShift.status ?? "scheduled",
      }
      this.mockShifts.push(newShift);
      return {
        success: true,
        data: newShift
      }
    }

    if (endpoint.startsWith('/api/shifts/') && method === 'PUT') {
      const updatedShift = JSON.parse(options.body as string);
      const id = endpoint.split('/').pop();
      const index = this.mockShifts.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.mockShifts[index] = {
          ...this.mockShifts[index],
          ...updatedShift,
          id: this.mockShifts[index].id,
        };
        return {
          success: true,
          data: this.mockShifts[index]
        }
      }
    }

    if (endpoint.startsWith('/api/shifts/') && method === 'DELETE') {
      const id = endpoint.split('/').pop();
      const index = this.mockShifts.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.mockShifts.splice(index, 1);
        return {
          success: true
        }
      }
    }

    if (endpoint.startsWith('/api/requests') && method === 'GET') {
      return {
        success: true,
        data: this.mockTimeOffRequests.map((request) => ({ ...request })),
        count: this.mockTimeOffRequests.length
      }
    }

    if (endpoint.startsWith('/api/requests/') && endpoint.endsWith('/approve') && method === 'PUT') {
      const id = endpoint.split('/')[3];
      const index = this.mockTimeOffRequests.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.mockTimeOffRequests[index] = {
          ...this.mockTimeOffRequests[index],
          status: "approved",
        }
        return {
          success: true,
          data: this.mockTimeOffRequests[index]
        }
      }
    }

    if (endpoint.startsWith('/api/requests/') && endpoint.endsWith('/deny') && method === 'PUT') {
      const id = endpoint.split('/')[3];
      const index = this.mockTimeOffRequests.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.mockTimeOffRequests[index] = {
          ...this.mockTimeOffRequests[index],
          status: "denied",
        }
        return {
          success: true,
          data: this.mockTimeOffRequests[index]
        }
      }
    }

    if (endpoint === "/api/payroll" && method === "GET") {
      return {
        success: true,
        data: this.mockPayroll.map((entry) => ({ ...entry })),
        count: this.mockPayroll.length,
      }
    }

    // Default mock response
    return {
      success: true,
      data: [],
      message: 'Mock data - backend not available'
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return Promise.resolve(this.getMockData(endpoint, options.method || 'GET', options));
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.success && response.data?.token) {
      this.token = response.data.token
      localStorage.setItem('auth-token', response.data.token)
    }
    
    return response
  }

  async logout() {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    })
    
    this.token = null
    localStorage.removeItem('auth-token')
    
    return response
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  // Employee methods
  async getEmployees() {
    return this.request('/api/employees')
  }

  async getEmployee(id: string) {
    return this.request(`/api/employees/${id}`)
  }

  async createEmployee(data: any) {
    return this.request('/api/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEmployee(id: string, data: any) {
    return this.request(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEmployee(id: string) {
    return this.request(`/api/employees/${id}`, {
      method: 'DELETE',
    })
  }

  // Shift methods
  async getShifts(params?: { startDate?: string; endDate?: string; employee?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.employee) queryParams.append('employee', params.employee)
    
    const endpoint = `/api/shifts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async getShift(id: string) {
    return this.request(`/api/shifts/${id}`)
  }

  async createShift(data: any) {
    return this.request('/api/shifts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateShift(id: string, data: any) {
    return this.request(`/api/shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteShift(id: string) {
    return this.request(`/api/shifts/${id}`, {
      method: 'DELETE',
    })
  }

  // Time-off request methods
  async getRequests(params?: { status?: string; employee?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.employee) queryParams.append('employee', params.employee)
    
    const endpoint = `/api/requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  // Alias for getRequests to match frontend usage
  async getTimeOffRequests(params?: { status?: string; employee?: string }) {
    return this.getRequests(params)
  }

  async getRequest(id: string) {
    return this.request(`/api/requests/${id}`)
  }

  async createRequest(data: any) {
    return this.request('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async approveRequest(id: string, reviewNotes?: string) {
    return this.request(`/api/requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ reviewNotes }),
    })
  }

  async denyRequest(id: string, reviewNotes?: string) {
    return this.request(`/api/requests/${id}/deny`, {
      method: 'PUT',
      body: JSON.stringify({ reviewNotes }),
    })
  }

  // Payroll methods
  async getPayroll(params?: { period?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.period) queryParams.append('period', params.period)
    
    const endpoint = `/api/payroll${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async generatePayroll(period: string) {
    return this.request('/api/payroll/generate', {
      method: 'POST',
      body: JSON.stringify({ period }),
    })
  }

  async exportPayroll(period?: string) {
    const target = period
      ? this.mockPayroll.filter((entry) => entry.period === period)
      : this.mockPayroll

    const csvHeader = "Employee,Role,Hours Worked,Hourly Rate,Total Pay,Period"
    const csvRows = target.map((entry) =>
      [
        entry.employeeName,
        entry.role,
        entry.hoursWorked,
        entry.hourlyRate,
        entry.totalPay,
        entry.period,
      ].join(","),
    )

    const csvContent = [csvHeader, ...csvRows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payroll-${period || 'mock'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    return { success: true }
  }

  async updatePayrollStatus(id: string, status: string) {
    return this.request(`/api/payroll/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
