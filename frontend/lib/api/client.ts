import { employees, shifts, timeOffRequests, users } from '../data/mock-data';

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
        data: employees,
        count: employees.length
      }
    }

    if (endpoint === '/api/shifts' && method === 'GET') {
      return {
        success: true,
        data: shifts,
        count: shifts.length
      }
    }

    if (endpoint.startsWith('/api/shifts') && method === 'POST') {
      const newShift = JSON.parse(options.body as string);
      newShift.id = shifts.length + 1;
      shifts.push(newShift);
      return {
        success: true,
        data: newShift
      }
    }

    if (endpoint.startsWith('/api/shifts/') && method === 'PUT') {
      const updatedShift = JSON.parse(options.body as string);
      const id = endpoint.split('/').pop();
      const index = shifts.findIndex(s => s.id.toString() === id);
      if (index !== -1) {
        shifts[index] = { ...shifts[index], ...updatedShift };
        return {
          success: true,
          data: shifts[index]
        }
      }
    }

    if (endpoint.startsWith('/api/shifts/') && method === 'DELETE') {
      const id = endpoint.split('/').pop();
      const index = shifts.findIndex(s => s.id.toString() === id);
      if (index !== -1) {
        shifts.splice(index, 1);
        return {
          success: true
        }
      }
    }

    if (endpoint.startsWith('/api/requests') && method === 'GET') {
      return {
        success: true,
        data: timeOffRequests,
        count: timeOffRequests.length
      }
    }

    if (endpoint.startsWith('/api/requests/') && endpoint.endsWith('/approve') && method === 'PUT') {
      const id = endpoint.split('/')[3];
      const index = timeOffRequests.findIndex(r => r.id.toString() === id);
      if (index !== -1) {
        timeOffRequests[index].status = 'approved';
        return {
          success: true,
          data: timeOffRequests[index]
        }
      }
    }

    if (endpoint.startsWith('/api/requests/') && endpoint.endsWith('/deny') && method === 'PUT') {
      const id = endpoint.split('/')[3];
      const index = timeOffRequests.findIndex(r => r.id.toString() === id);
      if (index !== -1) {
        timeOffRequests[index].status = 'denied';
        return {
          success: true,
          data: timeOffRequests[index]
        }
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
    const queryParams = new URLSearchParams()
    if (period) queryParams.append('period', period)
    
    const endpoint = `/api/payroll/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to export payroll')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payroll-${period || 'all'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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