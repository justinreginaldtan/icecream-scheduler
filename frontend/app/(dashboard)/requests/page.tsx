"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import type { TimeOffRequest } from "@/lib/data/mock-data"

export default function RequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState<Record<string, "approve" | "deny" | null>>(
    {}
  )
  const [newRequest, setNewRequest] = useState({ startDate: "", endDate: "", reason: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isManager = user?.role === "manager"

  useEffect(() => {
    if (!user) return

    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getTimeOffRequests()
        if (response.success) {
          setRequests(
            (response.data || []).map((request: any) => ({
              ...request,
              id: request.id?.toString?.() ?? "",
              employeeId: request.employeeId?.toString?.() ?? "",
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [user])

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    const payload: TimeOffRequest = {
      id: `request-${Date.now()}`,
      employeeId: user.id,
      employeeName: user.name,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate || newRequest.startDate,
      reason: newRequest.reason,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    }

    try {
      await apiClient.createRequest(payload)
      setRequests((current) => [...current, payload])
      setNewRequest({ startDate: "", endDate: "", reason: "" })
      toast({
        title: "Request submitted",
        description: "Your time-off request has been sent for review.",
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    setLoadingRequests((prev) => ({ ...prev, [requestId]: "approve" }))

    try {
      await apiClient.approveRequest(requestId)

      setRequests((current) =>
        current.map((req) => (req.id === requestId ? { ...req, status: "approved" as const } : req))
      )

      toast({
        title: "Request approved",
        description: "The time-off request has been approved successfully.",
        className: "bg-[var(--brandBlue)] text-white border-[var(--brandBlue)]",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request.",
        variant: "destructive",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const handleDeny = async (requestId: string) => {
    setLoadingRequests((prev) => ({ ...prev, [requestId]: "deny" }))

    try {
      await apiClient.denyRequest(requestId)

      setRequests((current) =>
        current.map((req) => (req.id === requestId ? { ...req, status: "denied" as const } : req))
      )

      toast({
        title: "Request denied",
        description: "The time-off request has been denied.",
        className: "bg-[var(--brandPink)] text-white border-[var(--brandPink)]",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny request.",
        variant: "destructive",
      })
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Approved
          </Badge>
        )
      case "denied":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Denied</Badge>
        )
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Pending
          </Badge>
        )
    }
  }

  const visibleRequests = isManager
    ? requests
    : requests.filter((req) => req.employeeId === user?.id || req.employeeName === user?.name)

  const pendingCount = visibleRequests.filter((req) => req.status === "pending").length
  const approvedCount = visibleRequests.filter((req) => req.status === "approved").length

  if (loading) {
    return (
      <AppLayout>
        <div className="px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              <p className="mt-2 text-[color:rgba(44,42,41,.6)]">Loading requests...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)]">Time-Off Requests</h1>
          <p className="text-[color:rgba(44,42,41,.6)] mt-1">
            {isManager ? "Review and manage employee time-off requests" : "Submit and track your requests"}
          </p>
        </div>

        {!isManager && (
          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl mb-8">
            <CardHeader>
              <CardTitle className="text-[var(--text)]">Request Time Off</CardTitle>
              <CardDescription>Submit a new request for your manager to review</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                      className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newRequest.endDate}
                      min={newRequest.startDate}
                      onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                      className="focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <textarea
                    id="reason"
                    required
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)]"
                    rows={3}
                    placeholder="Share a brief note about your request"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting || !newRequest.startDate || !newRequest.reason.trim().length
                  }
                  aria-busy={isSubmitting}
                  className="bg-[var(--primary)] text-white hover:bg-[color:rgba(244,108,91,.9)] focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">
                Approved This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{requests.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">All Requests</CardTitle>
            <CardDescription>
              {isManager
                ? "Review and take action on time-off requests"
                : "See the status of your submissions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visibleRequests.map((request) => {
                const isLoading = loadingRequests[request.id]
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors duration-200 hover:bg-[var(--muted)]/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[var(--text)]">{request.employeeName}</h3>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[color:rgba(44,42,41,.6)] mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(request.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(request.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-[color:rgba(44,42,41,.6)]">
                        <span className="font-medium text-[var(--text)]">Reason:</span>{" "}
                        {request.reason}
                      </p>

                      <p className="text-xs text-[color:rgba(44,42,41,.6)] mt-1">
                        Submitted on{" "}
                        {new Date(request.submittedDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {request.status === "pending" && isManager && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={!!isLoading}
                          aria-busy={isLoading === "approve"}
                          className="bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                          data-testid={`approve-request-${request.id}`}
                        >
                          {isLoading === "approve" ? (
                            <>
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeny(request.id)}
                          disabled={!!isLoading}
                          aria-busy={isLoading === "deny"}
                          className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                          data-testid={`deny-request-${request.id}`}
                        >
                          {isLoading === "deny" ? (
                            <>
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                              Denying...
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-4 w-4" />
                              Deny
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}

              {visibleRequests.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[color:rgba(44,42,41,.6)]">
                    No time-off requests at this time
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
