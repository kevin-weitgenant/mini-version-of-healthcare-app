import express from 'express';
import { db } from '../config/db';
import { doctorsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const dbDoctors = await db.select().from(doctorsTable);
    
    // Transform rating from integer to decimal (e.g., 49 -> 4.9)
    const doctors = dbDoctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      rating: doctor.rating / 10,
      avatar: doctor.avatar
    }));
    
    res.json({ ok: true, doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch doctors' });
  }
});

// GET /api/doctors/:id - Get a specific doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    
    const dbDoctor = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, doctorId))
      .limit(1);
    
    if (!dbDoctor || dbDoctor.length === 0) {
      return res.status(404).json({ ok: false, error: 'Doctor not found' });
    }
    
    // Transform rating from integer to decimal
    const doctor = {
      id: dbDoctor[0].id,
      name: dbDoctor[0].name,
      specialty: dbDoctor[0].specialty,
      rating: dbDoctor[0].rating / 10,
      avatar: dbDoctor[0].avatar
    };
    
    res.json({ ok: true, doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch doctor' });
  }
});

export default router;

