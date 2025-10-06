import { apiRequest } from "../config"

export interface HealthTracking {
  id: number
  patientId: number
  painLevel: number
  energyLevel: number
  notes: string | null
  createdAt: string
}

export interface HealthTrackingResponse {
  ok: boolean
  entries: HealthTracking[]
}

export interface CreateHealthTrackingRequest {
  painLevel: number
  energyLevel: number
  notes?: string
}

export interface CreateHealthTrackingResponse {
  ok: boolean
  entry: HealthTracking
}

export async function fetchHealthTracking(): Promise<HealthTracking[]> {
  const data = await apiRequest<HealthTrackingResponse>("/track")
  return data.entries
}

export async function createHealthTracking(
  request: CreateHealthTrackingRequest
): Promise<HealthTracking> {
  const data = await apiRequest<CreateHealthTrackingResponse>("/track", {
    method: "POST",
    body: JSON.stringify(request),
  })
  return data.entry
}

