import express, { Request, Response } from 'express';
import { db } from '../config/db';
import { appointmentsTable, doctorsTable, usersTable, treatmentPlansTable } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';
import { generateTreatmentPlan } from '../utils/generateTreatmentPlan';
import { 
  asyncHandler, 
  DatabaseError, 
  ValidationError, 
  NotFoundError, 
  AuthenticationError 
} from '../utils/errorHandler';

const router = express.Router();

// GET /api/appointments - Get all appointments for the logged-in user
router.get('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    const appointments = await db
      .select({
        id: appointmentsTable.id,
        patientId: appointmentsTable.patientId,
        doctorId: appointmentsTable.doctorId,
        appointmentDateTime: appointmentsTable.appointmentDateTime,
        timezone: appointmentsTable.timezone,
        visitReason: appointmentsTable.visitReason,
        status: appointmentsTable.status,
        createdAt: appointmentsTable.createdAt,
        doctorName: doctorsTable.name,
        doctorSpecialty: doctorsTable.specialty,
        doctorAvatar: doctorsTable.avatar,
      })
      .from(appointmentsTable)
      .leftJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(eq(appointmentsTable.patientId, userId));
    
    res.json({ ok: true, appointments });
  } catch (error) {
    throw new DatabaseError('Failed to fetch appointments', error as Error);
  }
}));

// POST /api/appointments - Create a new appointment
router.post('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const { doctorId, appointmentDate, appointmentTime, visitReason, timezone } = req.body;

  // Validation
  if (!doctorId || typeof doctorId !== 'number') {
    throw new ValidationError('Invalid doctor ID');
  }
  if (!appointmentDate || typeof appointmentDate !== 'string') {
    throw new ValidationError('Invalid appointment date');
  }
  if (!appointmentTime || typeof appointmentTime !== 'string') {
    throw new ValidationError('Invalid appointment time');
  }
  if (!visitReason || typeof visitReason !== 'string' || !visitReason.trim()) {
    throw new ValidationError('Visit reason is required');
  }
  if (!timezone || typeof timezone !== 'string') {
    throw new ValidationError('Timezone is required');
  }

  try {
    // Verify doctor exists
    const doctor = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, doctorId))
      .limit(1);
    
    if (!doctor || doctor.length === 0) {
      throw new NotFoundError('Doctor not found');
    }

    // Convert local date/time to UTC for storage
    // Parse the time from "HH:MM AM/PM" format to 24-hour format
    const parseTime = (timeStr: string): string => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);
      
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes}`;
    };

    // Create a date in the user's timezone, then convert to UTC
    const time24Hour = parseTime(appointmentTime);
    const localDateTimeStr = `${appointmentDate}T${time24Hour}`;
    
    // Create date object assuming the input is in the user's timezone
    // We'll store it as UTC but preserve the timezone info
    const localDateTime = new Date(localDateTimeStr);
    
    // Validate the date is valid
    if (isNaN(localDateTime.getTime())) {
      console.error('Invalid date/time combination:', { appointmentDate, appointmentTime, time24Hour, localDateTimeStr });
      throw new ValidationError('Invalid appointment date or time');
    }
    
    const appointmentDateTime = localDateTime;

    // Create appointment
    const newAppointment = await db
      .insert(appointmentsTable)
      .values({
        patientId: userId,
        doctorId,
        appointmentDateTime,
        timezone,
        visitReason: visitReason.trim(),
        status: 'scheduled',
      })
      .returning();

    // Auto-generate treatment plan
    try {
      const treatmentPlan = generateTreatmentPlan(visitReason.trim(), doctor[0].specialty);
      
      await db
        .insert(treatmentPlansTable)
        .values({
          appointmentId: newAppointment[0].id,
          diagnosisName: treatmentPlan.diagnosisName,
          diagnosisDescription: treatmentPlan.diagnosisDescription,
          medicines: treatmentPlan.medicines,
          lifestyleAdvice: treatmentPlan.lifestyleAdvice,
          doctorNotes: treatmentPlan.doctorNotes,
        });

      console.log(`Treatment plan generated for appointment ${newAppointment[0].id}`);
    } catch (treatmentError) {
      // Log error but don't fail the appointment creation
      console.error('Error generating treatment plan:', treatmentError);
    }

    res.status(201).json({ 
      ok: true, 
      appointment: {
        ...newAppointment[0],
        hasTreatmentPlan: true
      }
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError('Failed to create appointment', error as Error);
  }
}));

export default router;

