"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Calendar, Loader2, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"

export default function RequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState<Record<string, "approve" | "deny" | null>>({})

  useEffect(() => {
    if (!user) return

    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getTimeOffRequests()
        if (response.success) {
          setRequests(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [user])

  const handleApprove = async (requestId: string) => {
    setLoadingRequests((prev) => ({ ...prev, [requestId]: "approve" }))

    try {
      await apiClient.approveRequest(requestId)

      setRequests(requests.map((req) => (req._id === requestId ? { ...req, status: "approved" as const } : req)))

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

      setRequests(requests.map((req) => (req._id === requestId ? { ...req, status: "denied" as const } : req)))

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
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Approved</Badge>
      case "denied":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Denied</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Pending</Badge>
    }
  }

  const pendingCount = requests.filter((req) => req.status === "pending").length
  const approvedCount = requests.filter((req) => req.status === "approved").length

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
        <div className="mb-10 animate-slide-up">
          <div>
            <h1 className="mb-2" style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.1', color: '#2A2A2A', fontFamily: 'var(--font-display)' }}>
              Time-Off Requests
            </h1>
            <p className="text-base" style={{ color: '#575757', fontWeight: '500' }}>
              Review and respond to your team's requests
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[color:rgba(44,42,41,.7)]">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--text)]">{requests.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">All Requests</CardTitle>
            <CardDescription>Review and take action on time-off requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => {
                const isLoading = loadingRequests[request._id]
                return (
                  <div
                    key={request._id}
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
                        <span className="font-medium text-[var(--text)]">Reason:</span> {request.reason}
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

                    {request.status === "pending" && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleApprove(request._id)}
                          disabled={!!isLoading}
                          aria-busy={isLoading === "approve"}
                          variant="default"
                          className="bg-green-600 text-white hover:bg-green-700"
                          data-testid={`approve-request-${request._id}`}
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
                          onClick={() => handleDeny(request._id)}
                          disabled={!!isLoading}
                          aria-busy={isLoading === "deny"}
                          className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-[var(--brandBlue)] focus-visible:outline-none"
                          data-testid={`deny-request-${request._id}`}
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

              {requests.length === 0 && (
                <div className="text-center py-16 space-y-5">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[rgba(220,243,238,0.3)] to-[rgba(183,231,223,0.2)] rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <FileText className="h-10 w-10 text-[color:rgba(68,176,156,0.7)]" />
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--charcoal-800)', fontFamily: 'var(--font-display)' }}>
                      All caught up
                    </h3>
                    <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--charcoal-600)', fontWeight: '400' }}>
                      No time-off requests waiting for review right now.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
