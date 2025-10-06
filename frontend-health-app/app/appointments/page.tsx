"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentsList } from "@/components/appointments-list"
import { useAppointments } from "@/api/appointments/hooks"
import { Loader2 } from "lucide-react"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export default function AppointmentsPage() {
  const isAuthed = useRequireAuth("/")
  const [activeTab, setActiveTab] = useState("upcoming")
  const { data: appointments, isLoading, error } = useAppointments()
  
  if (!isAuthed) return null
  
  const upcomingAppointments = (appointments || []).filter(apt => 
    apt.status === "scheduled" && new Date(apt.appointmentDateTime) >= new Date()
  )
  
  const pastAppointments = (appointments || []).filter(apt => 
    apt.status === "completed" || 
    (apt.status === "scheduled" && new Date(apt.appointmentDateTime) < new Date())
  )
  
  // Removed cancelled tab; no need to compute cancelled appointments

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-balance">My Appointments</h1>
              <p className="text-muted-foreground mt-1">View and manage your appointments</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading your appointments...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-muted-foreground py-12">
                <p>
                  {error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized"))
                    ? "Please log in to view your appointments"
                    : "Failed to load appointments. Please try again later."}
                </p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                  <AppointmentsList appointments={upcomingAppointments} type="upcoming" />
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                  <AppointmentsList appointments={pastAppointments} type="past" />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
