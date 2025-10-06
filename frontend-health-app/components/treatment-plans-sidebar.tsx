"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText } from "lucide-react"
import { formatAppointmentDate } from "@/lib/timezone"
import { useRouter, useSearchParams } from "next/navigation"
import type { TreatmentPlanWithAppointment } from "@/api/treatment-plans/apiClient"
import { cn } from "@/lib/utils"

interface TreatmentPlansSidebarProps {
  plans: TreatmentPlanWithAppointment[]
}

export function TreatmentPlansSidebar({ plans }: TreatmentPlansSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentAppointmentId = Number(searchParams.get("appointmentId"))

  const handleSelectPlan = (appointmentId: number) => {
    router.push(`/treatment-plan?appointmentId=${appointmentId}`)
  }

  if (plans.length === 0) {
    return (
      <div className="w-80 border-r bg-muted/20 p-4">
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No Treatment Plans</h3>
          <p className="text-sm text-muted-foreground">
            You don&#39;t have any treatment plans yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <aside 
      className="w-80 border-r bg-muted/20 p-4 overflow-y-auto hidden lg:block"
      aria-label="Treatment plans navigation"
      role="navigation"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" aria-hidden="true" />
          Treatment Plans
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {plans.length} {plans.length === 1 ? "plan" : "plans"} available
        </p>
      </div>

      <nav className="space-y-3" aria-label="Available treatment plans">
        {plans.map((plan) => {
          const isActive = plan.appointmentId === currentAppointmentId
          const formattedDate = formatAppointmentDate(plan.appointment.date)
          const doctorInitial = plan.appointment.doctorName?.split(" ").pop()?.[0] || "D"

          return (
            <Card
              key={plan.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary",
                isActive && "ring-2 ring-primary shadow-md"
              )}
              onClick={() => handleSelectPlan(plan.appointmentId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleSelectPlan(plan.appointmentId)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View treatment plan from ${formattedDate} with ${plan.appointment.doctorName} for ${plan.diagnosisName}`}
              aria-current={isActive ? "page" : undefined}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={plan.appointment.doctorAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{doctorInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {plan.appointment.doctorName || "Unknown Doctor"}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {plan.appointment.doctorSpecialty}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formattedDate}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="mt-2 text-xs break-words whitespace-normal max-w-full"
                    >
                      {plan.diagnosisName}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </nav>
    </aside>
  )
}

