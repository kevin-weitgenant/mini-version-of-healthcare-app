"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, FileText } from "lucide-react"
import { useAppointments } from "@/api/appointments/hooks"
import { useTreatmentPlans } from "@/api/treatment-plans/hooks"

export function StatsCards() {
  const { data: appointments } = useAppointments()
  const { data: treatmentPlans } = useTreatmentPlans()
  
  const upcomingCount = (appointments || []).filter(apt => 
    apt.status === "scheduled" && new Date(apt.appointmentDateTime) >= new Date()
  ).length
  const activeTreatmentPlansCount = (treatmentPlans || []).length
  
  const stats = [
    {
      label: "Upcoming Appointments",
      value: upcomingCount.toString(),
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      label: "Active Treatment Plans",
      value: activeTreatmentPlansCount.toString(),
      icon: FileText,
      color: "text-purple-600",
    },
  ]
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-lg bg-muted", stat.color)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
