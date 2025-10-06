import { apiRequest } from "../config"

export interface Appointment {
  id: number
  patientId: number
  doctorId: number
  appointmentDateTime: string // UTC timestamp
  timezone: string // User's timezone
  visitReason: string
  status: string
  createdAt: string
  doctorName: string | null
  doctorSpecialty: string | null
  doctorAvatar: string | null
}

export interface AppointmentsResponse {
  ok: boolean
  appointments: Appointment[]
}

export interface CreateAppointmentRequest {
  doctorId: number
  appointmentDate: string
  appointmentTime: string
  timezone: string
  visitReason: string
}

export interface CreateAppointmentResponse {
  ok: boolean
  appointment: Appointment
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const data = await apiRequest<AppointmentsResponse>("/appointments")
  return data.appointments
}

export async function createAppointment(
  request: CreateAppointmentRequest
): Promise<Appointment> {
  const data = await apiRequest<CreateAppointmentResponse>("/appointments", {
    method: "POST",
    body: JSON.stringify(request),
  })
  return data.appointment
}

