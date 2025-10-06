import type { TreatmentPlan, Medicine } from '@backend/db/schema'
import { apiRequest } from "../config"

// Re-export types for components to use
export type { TreatmentPlan, Medicine }

// Response wrapper from backend
interface TreatmentPlanResponse {
  ok: boolean
  treatmentPlan: TreatmentPlanWithAppointment
}

// Extended type with appointment context
export interface TreatmentPlanWithAppointment extends TreatmentPlan {
  appointment: {
    date: string
    time: string
    visitReason: string
    doctorName: string | null
    doctorSpecialty: string | null
    doctorAvatar: string | null
  }
}

interface TreatmentPlansResponse {
  ok: boolean
  treatmentPlans: TreatmentPlanWithAppointment[]
}

export async function fetchTreatmentPlanByAppointmentId(
  appointmentId: number
): Promise<TreatmentPlanWithAppointment> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Fetching treatment plan for appointment ID:', appointmentId)
  }
  
  const data = await apiRequest<TreatmentPlanResponse>(
    `/treatment-plans/${appointmentId}`
  )
  
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Treatment plan fetched successfully:', data.treatmentPlan)
  }
  
  return data.treatmentPlan
}

export async function fetchAllTreatmentPlans(): Promise<TreatmentPlanWithAppointment[]> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Fetching all treatment plans')
  }
  
  const data = await apiRequest<TreatmentPlansResponse>(`/treatment-plans`)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ All treatment plans fetched successfully:', data.treatmentPlans.length, 'plans found')
  }
  
  return data.treatmentPlans
}

