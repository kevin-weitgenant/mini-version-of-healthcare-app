import express, { Request, Response } from 'express';
import { db } from '../config/db';
import { treatmentPlansTable, appointmentsTable, doctorsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';
import { 
  asyncHandler, 
  DatabaseError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError 
} from '../utils/errorHandler';

const router = express.Router();

// GET /api/treatment-plans/:appointmentId - Get treatment plan for a specific appointment
router.get('/:appointmentId', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const appointmentId = parseInt(req.params.appointmentId);
  
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  if (isNaN(appointmentId)) {
    throw new ValidationError('Invalid appointment ID');
  }

  try {
    // First, verify the appointment belongs to the user
    const appointment = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, appointmentId))
      .limit(1);

    if (!appointment || appointment.length === 0) {
      throw new NotFoundError('Appointment not found');
    }

    if (appointment[0].patientId !== userId) {
      throw new AuthenticationError('Access denied');
    }

    // Fetch the treatment plan with doctor info
    const treatmentPlan = await db
      .select({
        id: treatmentPlansTable.id,
        appointmentId: treatmentPlansTable.appointmentId,
        diagnosisName: treatmentPlansTable.diagnosisName,
        diagnosisDescription: treatmentPlansTable.diagnosisDescription,
        medicines: treatmentPlansTable.medicines,
        lifestyleAdvice: treatmentPlansTable.lifestyleAdvice,
        doctorNotes: treatmentPlansTable.doctorNotes,
        createdAt: treatmentPlansTable.createdAt,
        appointmentDateTime: appointmentsTable.appointmentDateTime,
        timezone: appointmentsTable.timezone,
        visitReason: appointmentsTable.visitReason,
        doctorName: doctorsTable.name,
        doctorSpecialty: doctorsTable.specialty,
        doctorAvatar: doctorsTable.avatar,
      })
      .from(treatmentPlansTable)
      .innerJoin(appointmentsTable, eq(treatmentPlansTable.appointmentId, appointmentsTable.id))
      .leftJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(eq(treatmentPlansTable.appointmentId, appointmentId))
      .limit(1);

    if (!treatmentPlan || treatmentPlan.length === 0) {
      throw new NotFoundError('Treatment plan not found');
    }

    // With jsonb, Drizzle automatically parses the fields
    const plan = treatmentPlan[0];
    
    // Format the response to include appointment data
    const formattedPlan = {
      ...plan,
      appointment: {
        date: plan.appointmentDateTime,
        time: plan.timezone,
        visitReason: plan.visitReason,
        doctorName: plan.doctorName,
        doctorSpecialty: plan.doctorSpecialty,
        doctorAvatar: plan.doctorAvatar,
      },
    };

    res.json({ ok: true, treatmentPlan: formattedPlan });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AuthenticationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError('Failed to fetch treatment plan', error as Error);
  }
}));

// GET /api/treatment-plans - Get all treatment plans for the logged-in user
router.get('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    // Fetch all treatment plans for user's appointments
    const treatmentPlans = await db
      .select({
        id: treatmentPlansTable.id,
        appointmentId: treatmentPlansTable.appointmentId,
        diagnosisName: treatmentPlansTable.diagnosisName,
        diagnosisDescription: treatmentPlansTable.diagnosisDescription,
        medicines: treatmentPlansTable.medicines,
        lifestyleAdvice: treatmentPlansTable.lifestyleAdvice,
        doctorNotes: treatmentPlansTable.doctorNotes,
        createdAt: treatmentPlansTable.createdAt,
        appointmentDateTime: appointmentsTable.appointmentDateTime,
        timezone: appointmentsTable.timezone,
        visitReason: appointmentsTable.visitReason,
        doctorName: doctorsTable.name,
        doctorSpecialty: doctorsTable.specialty,
        doctorAvatar: doctorsTable.avatar,
      })
      .from(treatmentPlansTable)
      .innerJoin(appointmentsTable, eq(treatmentPlansTable.appointmentId, appointmentsTable.id))
      .leftJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(eq(appointmentsTable.patientId, userId))
      .orderBy(appointmentsTable.appointmentDate);

    // With jsonb, Drizzle automatically parses the fields
    const parsedPlans = treatmentPlans.map(plan => ({
      ...plan,
      appointment: {
        date: plan.appointmentDateTime,
        time: plan.timezone,
        visitReason: plan.visitReason,
        doctorName: plan.doctorName,
        doctorSpecialty: plan.doctorSpecialty,
        doctorAvatar: plan.doctorAvatar,
      },
    }));

    res.json({ ok: true, treatmentPlans: parsedPlans });
  } catch (error) {
    throw new DatabaseError('Failed to fetch treatment plans', error as Error);
  }
}));

export default router;

