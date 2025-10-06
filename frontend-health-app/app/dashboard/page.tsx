"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatsCards } from "@/components/stats-cards"
import { RecentAppointments } from "@/components/recent-appointments"
import { HealthTrackingChart } from "@/components/health-tracking-chart"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/api/auth/hooks"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export default function DashboardPage() {
  const router = useRouter()
  const isAuthed = useRequireAuth("/")
  const { data: userData } = useCurrentUser()
  const userName = userData?.name || "User"
  
  if (!isAuthed) return null
  
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-balance">Welcome back, {userName}</h1>
              <p className="text-muted-foreground mt-1">Here's your health overview</p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => router.push("/book-appointment")}>
              <Calendar className="h-5 w-5" />
              Book Appointment
            </Button>
          </div>

          <StatsCards />

          <div className="grid lg:grid-cols-2 gap-6">
            <RecentAppointments />
            <HealthTrackingChart />
          </div>
        </main>
      </div>
    </div>
  )
}
