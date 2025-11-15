"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api/client"
import { Loader2 } from "lucide-react"

const ROLE_OPTIONS = [
  { label: "Store Manager", value: "Store Manager" },
  { label: "Assistant Manager", value: "Assistant Manager" },
  { label: "Shift Lead", value: "Shift Lead" },
  { label: "Scooper", value: "Scooper" },
  { label: "Cashier", value: "Cashier" },
  { label: "Barista", value: "Barista" },
]

const SHIFT_OPTIONS = [
  { label: "Opening", value: "Opening" },
  { label: "Midday", value: "Midday" },
  { label: "Afternoon", value: "Afternoon" },
  { label: "Closing", value: "Closing" },
]

const STATUS_OPTIONS = [
  { label: "Working", value: "Working" },
  { label: "Seasonal", value: "Seasonal" },
  { label: "Terminated", value: "Terminated" },
]

type EmployeeFormState = {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  email: string
  role: string
  hourlyRate: string
  hoursPerWeek: string
  hireDate: string
  availabilityNotes: string
  isActive: boolean
  preferredShift: string
  workingStatus: string
}

const createInitialFormState = (): EmployeeFormState => ({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  role: "",
  hourlyRate: "",
  hoursPerWeek: "",
  hireDate: "",
  availabilityNotes: "",
  isActive: true,
  preferredShift: SHIFT_OPTIONS[0].value,
  workingStatus: STATUS_OPTIONS[0].value,
})

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: (employee: any) => void
}

export function AddEmployeeModal({ isOpen, onClose, onCreated }: AddEmployeeModalProps) {
  const { toast } = useToast()
  const [formValues, setFormValues] = useState<EmployeeFormState>(() => createInitialFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = (field: keyof EmployeeFormState, value: string | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setFormValues(createInitialFormState())
    setError(null)
  }

  const handleClose = () => {
    if (isSubmitting) return
    resetForm()
    onClose()
  }

  const validateForm = () => {
    if (!formValues.firstName.trim() || !formValues.lastName.trim()) {
      setError("First and last name are required.")
      return false
    }

    if (!formValues.email.trim()) {
      setError("Email is required.")
      return false
    }

    if (!formValues.role) {
      setError("Please select a role.")
      return false
    }

    if (!formValues.dateOfBirth) {
      setError("Date of birth is required.")
      return false
    }

    if (!formValues.hireDate) {
      setError("Hire date is required.")
      return false
    }

    const hourlyRate = parseFloat(formValues.hourlyRate)
    if (Number.isNaN(hourlyRate) || hourlyRate < 0) {
      setError("Hourly rate must be a non-negative number.")
      return false
    }

    if (!formValues.hoursPerWeek) {
      setError("Weekly hours are required.")
      return false
    }

    const hoursPerWeek = parseFloat(formValues.hoursPerWeek)
    if (Number.isNaN(hoursPerWeek) || hoursPerWeek < 0) {
      setError("Hours per week must be a non-negative number.")
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const hourlyRate = parseFloat(formValues.hourlyRate)
      const hoursPerWeek = parseFloat(formValues.hoursPerWeek)
      const payload = {
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        name: `${formValues.firstName.trim()} ${formValues.lastName.trim()}`.trim(),
        email: formValues.email.trim().toLowerCase(),
        phone: formValues.phone.trim(),
        role: formValues.role,
        hourlyRate,
        hoursPerWeek,
        hireDate: formValues.hireDate,
        startDate: formValues.hireDate,
        dateOfBirth: formValues.dateOfBirth,
        availabilityNotes: formValues.availabilityNotes.trim(),
        isActive: formValues.isActive,
        workingStatus: formValues.workingStatus,
        preferredShift: formValues.preferredShift,
      }

      const response = await apiClient.createEmployee(payload)

      if (!response.success) {
        throw new Error(response.error || "Failed to create employee")
      }

      toast({
        title: "Employee created",
        description: "Employee has been added to your roster.",
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })

      if (response.data) {
        onCreated?.(response.data)
      }

      handleClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create employee"
      setError(message)
      toast({
        title: "Unable to save",
        description: message,
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormReady =
    formValues.firstName &&
    formValues.lastName &&
    formValues.email &&
    formValues.role &&
    formValues.dateOfBirth &&
    formValues.hireDate &&
    formValues.hourlyRate &&
    formValues.hoursPerWeek

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Employee</DialogTitle>
          <DialogDescription>
            Enter the new employee information below. All required fields are marked.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formValues.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formValues.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formValues.dateOfBirth}
                onChange={(event) => updateField("dateOfBirth", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                value={formValues.hireDate}
                onChange={(event) => updateField("hireDate", event.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formValues.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formValues.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formValues.role} onValueChange={(value) => updateField("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredShift">Preferred Shift</Label>
              <Select
                value={formValues.preferredShift}
                onValueChange={(value) => updateField("preferredShift", value)}
              >
                <SelectTrigger id="preferredShift">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIFT_OPTIONS.map((shift) => (
                    <SelectItem key={shift.value} value={shift.value}>
                      {shift.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate *</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.25"
                value={formValues.hourlyRate}
                onChange={(event) => updateField("hourlyRate", event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursPerWeek">Hours / Week *</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                min="0"
                step="0.5"
                value={formValues.hoursPerWeek}
                onChange={(event) => updateField("hoursPerWeek", event.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workingStatus">Working Status</Label>
              <Select
                value={formValues.workingStatus}
                onValueChange={(value) => updateField("workingStatus", value)}
              >
                <SelectTrigger id="workingStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border-subtle px-3 py-4">
              <div>
                <Label className="text-base">Active Status</Label>
                <p className="text-sm text-muted-foreground">Toggle off to keep inactive in schedules.</p>
              </div>
              <Switch
                checked={formValues.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityNotes">Availability</Label>
            <textarea
              id="availabilityNotes"
              value={formValues.availabilityNotes}
              onChange={(event) => updateField("availabilityNotes", event.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:ring-offset-2"
              placeholder="Example: Weekdays after 2pm, weekends flexible"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={!isFormReady || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
