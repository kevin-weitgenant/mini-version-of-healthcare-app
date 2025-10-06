import { apiRequest } from "../config"

export interface Doctor {
  id: number
  name: string
  specialty: string
  rating: number
  avatar: string
}

export interface DoctorsResponse {
  ok: boolean
  doctors: Doctor[]
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const data = await apiRequest<DoctorsResponse>("/doctors")
  return data.doctors
}

