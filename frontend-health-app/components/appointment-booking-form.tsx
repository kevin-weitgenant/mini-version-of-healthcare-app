"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, Star, Loader2 } from "lucide-react"
import type { Doctor } from "@/api/doctors/apiClient"
import { useCreateAppointment } from "@/api/appointments/hooks"
import { getUserTimezone, convertToUTC } from "@/lib/timezone"
import { toast } from "sonner"

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
]

interface AppointmentBookingFormProps {
  doctor: Doctor
  onBack: () => void
}

export function AppointmentBookingForm({ doctor, onBack }: AppointmentBookingFormProps) {
  const router = useRouter()
  // Set initial date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [date, setDate] = useState<Date | undefined>(tomorrow)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [reason, setReason] = useState("")
  
  const createAppointmentMutation = useCreateAppointment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !selectedTime || !reason.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    // Format date as YYYY-MM-DD
    const appointmentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    // Get user's timezone
    const userTimezone = getUserTimezone()

    try {
      const appointment = await createAppointmentMutation.mutateAsync({
        doctorId: doctor.id,
        appointmentDate,
        appointmentTime: selectedTime,
        timezone: userTimezone,
        visitReason: reason.trim(),
      })
      
      toast.success("Appointment booked successfully! Redirecting to your treatment plan...")
      
      // Small delay to ensure the user sees the success message
      setTimeout(() => {
        router.push(`/treatment-plan?appointmentId=${appointment.id}`)
      }, 1000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to book appointment")
    }
  }

  return (
    <div className="space-y-6 relative">
      {createAppointmentMutation.isPending && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Booking your appointment...</p>
          </div>
        </div>
      )}
      
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to doctors
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
              <AvatarFallback>{doctor.name.split(" ")[1][0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{doctor.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{doctor.specialty}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{doctor.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
              className="rounded-md border w-fit" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reason for Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="reason" className="sr-only">
              Reason for visit
            </Label>
            <Textarea
              id="reason"
              placeholder="Please describe your symptoms or reason for visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack} 
            className="flex-1 bg-transparent"
            disabled={createAppointmentMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  )
}
