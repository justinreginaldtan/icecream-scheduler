"use client"
import { useRouter } from "next/navigation"

export function useNav() {
  const router = useRouter()

  return {
    toDashboard: () => router.push("/"),
    toEmployeeDashboard: () => router.push("/employee"),
    toSchedule: () => router.push("/schedule"),
    toEmployees: () => router.push("/employees"),
    toRequests: () => router.push("/requests"),
    toPayroll: () => router.push("/payroll"),
    toSettings: () => router.push("/settings"),
    toLogin: () => router.push("/login"),
    toUnauthorized: () => router.push("/unauthorized"),
  }
}
