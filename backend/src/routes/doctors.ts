import express, { Request, Response } from 'express';
import { db } from '../config/db';
import { doctorsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { asyncHandler, DatabaseError, NotFoundError, ValidationError } from '../utils/errorHandler';

const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', asyncHandler(async (req: Request, res: Response) => {
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
    throw new DatabaseError('Failed to fetch doctors', error as Error);
  }
}));

// GET /api/doctors/:id - Get a specific doctor by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  
  if (isNaN(doctorId)) {
    throw new ValidationError('Invalid doctor ID');
  }
  
  try {
    const dbDoctor = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, doctorId))
      .limit(1);
    
    if (!dbDoctor || dbDoctor.length === 0) {
      throw new NotFoundError('Doctor not found');
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
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError('Failed to fetch doctor', error as Error);
  }
}));

export default router;

