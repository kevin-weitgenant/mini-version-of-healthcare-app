"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DoctorSelection } from "@/components/doctor-selection"
import { AppointmentBookingForm } from "@/components/appointment-booking-form"
import type { Doctor } from "@/api/doctors/apiClient"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export default function BookAppointmentPage() {
  const isAuthed = useRequireAuth("/")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  
  if (!isAuthed) return null

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-balance">Book an Appointment</h1>
              <p className="text-muted-foreground mt-1">Select a doctor and choose your preferred time</p>
            </div>

            {!selectedDoctor ? (
              <DoctorSelection onSelectDoctor={setSelectedDoctor} />
            ) : (
              <AppointmentBookingForm doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
