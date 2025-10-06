"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { useAppointments } from "@/api/appointments/hooks"
import { formatAppointmentDate } from "@/lib/timezone"

export function RecentAppointments() {
  const { data: appointments, isLoading, error } = useAppointments()
  
  const recentAppointments = (appointments || [])
    .filter(apt => apt.status === "scheduled")
    .slice(0, 3)
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load appointments"
    const isAuthError = errorMessage.includes("401") || errorMessage.includes("Unauthorized")
    const isNetworkError = errorMessage.includes("fetch") || errorMessage.includes("Network") || errorMessage.includes("Failed to fetch")
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          <p className="mb-2">
            {isAuthError 
              ? "Please log in to view appointments" 
              : isNetworkError
              ? "Unable to connect to server"
              : "Failed to load appointments"}
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
          )}
        </CardContent>
      </Card>
    )
  }
  
  if (!appointments || recentAppointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          <p>No upcoming appointments</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAppointments.map((appointment) => {
          const doctorInitial = appointment.doctorName?.split(" ").pop()?.[0] || "D"
          const formattedDate = formatAppointmentDate(appointment.appointmentDateTime)
          
          return (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <Avatar>
                <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
                <AvatarFallback>{doctorInitial}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{appointment.doctorName || "Unknown Doctor"}</p>
                <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty || "General"}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
              <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                {appointment.status}
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
