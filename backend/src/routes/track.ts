import express, { Request, Response } from 'express';
import { db } from '../config/db';
import { healthTrackingTable } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';
import { 
  asyncHandler, 
  DatabaseError, 
  ValidationError, 
  AuthenticationError 
} from '../utils/errorHandler';

const router = express.Router();

// GET /api/track - Get all health tracking entries for the logged-in user
router.get('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    const entries = await db
      .select()
      .from(healthTrackingTable)
      .where(eq(healthTrackingTable.patientId, userId))
      .orderBy(desc(healthTrackingTable.createdAt));
    
    res.json({ ok: true, entries });
  } catch (error) {
    throw new DatabaseError('Failed to fetch health tracking entries', error as Error);
  }
}));

// POST /api/track - Create a new health tracking entry
router.post('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AuthenticationError('Unauthorized');
  }

  const { painLevel, energyLevel, notes } = req.body;

  // Validation
  if (!painLevel || typeof painLevel !== 'number' || painLevel < 1 || painLevel > 10) {
    throw new ValidationError('Pain level must be a number between 1 and 10');
  }
  if (!energyLevel || typeof energyLevel !== 'number' || energyLevel < 1 || energyLevel > 10) {
    throw new ValidationError('Energy level must be a number between 1 and 10');
  }
  if (notes !== undefined && typeof notes !== 'string') {
    throw new ValidationError('Notes must be a string');
  }

  try {
    // Create health tracking entry
    const newEntry = await db
      .insert(healthTrackingTable)
      .values({
        patientId: userId,
        painLevel,
        energyLevel,
        notes: notes?.trim() || null,
      })
      .returning();

    res.status(201).json({ ok: true, entry: newEntry[0] });
  } catch (error) {
    throw new DatabaseError('Failed to create health tracking entry', error as Error);
  }
}));

export default router;

