import { 
  integer, 
  pgTable, 
  varchar, 
  text, 
  timestamp, 
  date, 
  time, 
  boolean,
  jsonb
} from "drizzle-orm/pg-core";

// Users table (Patients)
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(), // hashed
  timezone: varchar({ length: 50 }).default("UTC").notNull(), // User's timezone
  createdAt: timestamp().defaultNow().notNull(),
});

// Doctors table
export const doctorsTable = pgTable("doctors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  specialty: varchar({ length: 255 }).notNull(),
  rating: integer().notNull(), // Store as integer (e.g., 49 for 4.9)
  avatar: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Appointments table
export const appointmentsTable = pgTable("appointments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  patientId: integer().references(() => usersTable.id).notNull(),
  doctorId: integer().references(() => doctorsTable.id).notNull(),
  // New timezone-aware fields
  appointmentDateTime: timestamp({ withTimezone: true }).notNull(), // UTC timestamp
  timezone: varchar({ length: 50 }).notNull(), // User's timezone when appointment was created
  // Legacy fields (to be removed after migration)
  appointmentDate: date(),
  appointmentTime: time(),
  visitReason: text().notNull(),
  status: varchar({ length: 50 }).default("scheduled").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Medicine interface - used in schema and by utilities
export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Treatment Plans table
export const treatmentPlansTable = pgTable("treatment_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  appointmentId: integer().references(() => appointmentsTable.id).notNull(),
  diagnosisName: varchar({ length: 255 }).notNull(),
  diagnosisDescription: text().notNull(),
  medicines: jsonb().$type<Medicine[]>().notNull(),
  lifestyleAdvice: jsonb().$type<string[]>().notNull(),
  doctorNotes: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Health Tracking table
export const healthTrackingTable = pgTable("health_tracking", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  patientId: integer().references(() => usersTable.id).notNull(),
  painLevel: integer().notNull(), // 1-10 scale
  energyLevel: integer().notNull(), // 1-10 scale
  notes: text(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Export types for TypeScript
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Doctor = typeof doctorsTable.$inferSelect;
export type NewDoctor = typeof doctorsTable.$inferInsert;

export type Appointment = typeof appointmentsTable.$inferSelect;
export type NewAppointment = typeof appointmentsTable.$inferInsert;

export type TreatmentPlan = typeof treatmentPlansTable.$inferSelect;
export type NewTreatmentPlan = typeof treatmentPlansTable.$inferInsert;

export type HealthTracking = typeof healthTrackingTable.$inferSelect;
export type NewHealthTracking = typeof healthTrackingTable.$inferInsert;
