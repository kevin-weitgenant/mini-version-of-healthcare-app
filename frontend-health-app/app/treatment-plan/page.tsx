"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Pill, Heart, Activity, ArrowLeft, Calendar, Clock, FileText } from 'lucide-react'
import { useTreatmentPlans } from "@/api/treatment-plans/hooks"
import { TreatmentPlansSidebar } from "@/components/treatment-plans-sidebar"
import { formatAppointmentDate, formatAppointmentDateTime } from "@/lib/timezone"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export default function TreatmentPlanPage() {
  const isAuthed = useRequireAuth("/")
  const searchParams = useSearchParams()
  const router = useRouter()
  const appointmentId = searchParams.get("appointmentId")
  
  const { data: allPlans, isLoading, error } = useTreatmentPlans()
  
  if (!isAuthed) return null

  const handleDownloadPDF = () => {
    window.print()
  }
  
  // Find the specific treatment plan for this appointment
  const treatmentPlan = allPlans?.find(
    plan => plan.appointmentId === Number(appointmentId)
  )

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Treatment Plan Page Debug Info:')
    console.log('  - Appointment ID from URL:', appointmentId)
    console.log('  - All plans loaded:', allPlans?.length || 0)
    console.log('  - Found treatment plan:', !!treatmentPlan)
    console.log('  - Loading state:', isLoading)
    console.log('  - Error state:', error?.message || 'none')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-9 w-64 bg-muted animate-pulse rounded-md" />
                  <div className="h-5 w-48 bg-muted animate-pulse rounded-md" />
                </div>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted animate-pulse rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    const isAuthError = error instanceof Error && 
      (error.message.includes("401") || 
       error.message.includes("Unauthorized") ||
       error.message.includes("Authentication"))
    
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {isAuthError ? "Authentication Required" : "Error Loading Treatment Plan"}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {isAuthError 
                      ? "Please log in to view your treatment plans. Your session may have expired."
                      : error instanceof Error ? error.message : "Failed to load treatment plan"
                    }
                  </p>
                  <div className="flex gap-2">
                    {isAuthError ? (
                      <Button onClick={() => router.push("/login")}>
                        Go to Login
                      </Button>
                    ) : (
                      <Button onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => router.push("/appointments")}>
                      Back to Appointments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // If no appointment ID provided, show all treatment plans
  if (!appointmentId) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto" role="main" aria-label="All treatment plans">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-balance">All Treatment Plans</h1>
                  <p className="text-muted-foreground mt-1">View all your treatment plans</p>
                </div>
              </div>

              {allPlans && allPlans.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {allPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => router.push(`/treatment-plan?appointmentId=${plan.appointmentId}`)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{plan.diagnosisName}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Dr. {plan.appointment.doctorName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {plan.appointment.doctorSpecialty}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatAppointmentDate(plan.appointment.date)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {plan.diagnosisDescription}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {plan.medicines.length} medicine{plan.medicines.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-primary font-medium">
                            View Details →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Treatment Plans Found</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      You don't have any treatment plans yet. Book an appointment to get started.
                    </p>
                    <Button onClick={() => router.push("/book-appointment")}>
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    )
  }

  // If appointment ID provided but no treatment plan found
  if (!treatmentPlan) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Treatment Plan Not Found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    No treatment plan found for appointment ID: {appointmentId}. The doctor may not have created a treatment plan yet.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => router.push("/treatment-plan")}>
                      View All Plans
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/appointments")}>
                      Back to Appointments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const { date: formattedDate, time: formattedTime } = formatAppointmentDateTime(treatmentPlan.appointment.date)
  const doctorInitial = treatmentPlan.appointment.doctorName?.split(" ").pop()?.[0] || "D"

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          {allPlans && allPlans.length > 0 && (
            <TreatmentPlansSidebar plans={allPlans} />
          )}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto" role="main" aria-label="Treatment plan details">
            <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-2 mb-2 print:hidden">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/treatment-plan")} 
                className="gap-2"
                aria-label="View all treatment plans"
              >
                <FileText className="h-4 w-4" />
                All Plans
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/appointments")} 
                className="gap-2"
                aria-label="Go back to appointments page"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Appointments
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-balance">Treatment Plan</h1>
                <p className="text-muted-foreground mt-1">Your personalized care plan</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2 bg-transparent print:hidden" 
                  onClick={handleDownloadPDF}
                  aria-label="Download treatment plan as PDF"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent role="region" aria-label="Appointment information">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={treatmentPlan.appointment.doctorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{doctorInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{treatmentPlan.appointment.doctorName}</h3>
                    <p className="text-sm text-muted-foreground">{treatmentPlan.appointment.doctorSpecialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formattedTime}
                      </span>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Reason: </span>
                      {treatmentPlan.appointment.visitReason}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>Diagnosis</CardTitle>
                </div>
              </CardHeader>
              <CardContent role="region" aria-label="Diagnosis information">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-sm">
                    {treatmentPlan.diagnosisName}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {treatmentPlan.diagnosisDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>Prescribed Medicines</CardTitle>
                </div>
              </CardHeader>
              <CardContent role="region" aria-label="Prescribed medicines list">
                {treatmentPlan.medicines.length > 0 ? (
                  <div className="space-y-4">
                    {treatmentPlan.medicines.map((medicine, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{medicine.name}</h4>
                            <p className="text-sm text-muted-foreground">Dosage: {medicine.dosage}</p>
                            <p className="text-sm text-muted-foreground">Frequency: {medicine.frequency}</p>
                          </div>
                          <Badge variant="outline">{medicine.duration}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medicines prescribed</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>Lifestyle Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent role="region" aria-label="Lifestyle recommendations">
                {treatmentPlan.lifestyleAdvice.length > 0 ? (
                  <ul className="space-y-3">
                    {treatmentPlan.lifestyleAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{advice}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No lifestyle recommendations provided</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
              <CardTitle>Doctor&#39;s Notes</CardTitle>
              </CardHeader>
              <CardContent role="region" aria-label="Doctor's notes and recommendations">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {treatmentPlan.doctorNotes}
                </p>
              </CardContent>
            </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
