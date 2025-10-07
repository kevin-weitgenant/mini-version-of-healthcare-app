// Local type definitions for frontend
// These should match the backend schema types

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface TreatmentPlan {
  id: number;
  appointmentId: number;
  diagnosisName: string;
  diagnosisDescription: string;
  medicines: Medicine[];
  lifestyleAdvice: string[];
  doctorNotes: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  timezone: string;
  createdAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  createdAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  timezone: string;
  appointmentDate?: string;
  appointmentTime?: string;
  visitReason: string;
  status: string;
  createdAt: string;
}

export interface HealthTracking {
  id: number;
  patientId: number;
  painLevel: number;
  energyLevel: number;
  notes?: string;
  createdAt: string;
}
