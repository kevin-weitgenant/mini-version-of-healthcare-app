"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import type { Appointment } from "@/api/appointments/apiClient"
import { formatAppointmentDate } from "@/lib/timezone"

interface AppointmentsListProps {
  appointments: Appointment[]
  type: "upcoming" | "past"
}

export function AppointmentsList({ appointments, type }: AppointmentsListProps) {

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
          <p className="text-sm text-muted-foreground text-center">
            {type === "upcoming" && "You don't have any upcoming appointments"}
            {type === "past" && "You don't have any past appointments"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const doctorInitial = appointment.doctorName?.split(" ").pop()?.[0] || "D"
        const formattedDate = formatAppointmentDate(appointment.appointmentDateTime)
        
        return (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{doctorInitial}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{appointment.doctorName || "Unknown Doctor"}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty || "General"}</p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "scheduled"
                          ? "default"
                          : appointment.status === "completed"
                            ? "secondary"
                            : appointment.status === "cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>

                  {/* No action buttons for appointments */}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
