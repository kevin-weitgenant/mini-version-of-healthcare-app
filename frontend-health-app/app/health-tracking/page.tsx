"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { HealthTrackingForm } from "@/components/health-tracking-form"
import { HealthTrackingHistory } from "@/components/health-tracking-history"
import { HealthTrackingChart } from "@/components/health-tracking-chart"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export default function HealthTrackingPage() {
  const isAuthed = useRequireAuth("/")
  
  if (!isAuthed) return null
  
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-balance">Health Tracking</h1>
              <p className="text-muted-foreground mt-1">Monitor your daily health metrics</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <HealthTrackingForm />
              <HealthTrackingChart />
            </div>

            <HealthTrackingHistory />
          </div>
        </main>
      </div>
    </div>
  )
}
