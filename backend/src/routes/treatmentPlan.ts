import express from 'express';
import { db } from '../config/db';
import { treatmentPlansTable, appointmentsTable, doctorsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/treatment-plans/:appointmentId - Get treatment plan for a specific appointment
router.get('/:appointmentId', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const appointmentId = parseInt(req.params.appointmentId);
    
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    if (isNaN(appointmentId)) {
      return res.status(400).json({ ok: false, error: 'Invalid appointment ID' });
    }

    // First, verify the appointment belongs to the user
    const appointment = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, appointmentId))
      .limit(1);

    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ ok: false, error: 'Appointment not found' });
    }

    if (appointment[0].patientId !== userId) {
      return res.status(403).json({ ok: false, error: 'Access denied' });
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
      return res.status(404).json({ ok: false, error: 'Treatment plan not found' });
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
    console.error('Error fetching treatment plan:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch treatment plan' });
  }
});

// GET /api/treatment-plans - Get all treatment plans for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

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
    console.error('Error fetching treatment plans:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch treatment plans' });
  }
});

export default router;

