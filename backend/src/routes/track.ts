import express from 'express';
import { db } from '../config/db';
import { healthTrackingTable } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/track - Get all health tracking entries for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const entries = await db
      .select()
      .from(healthTrackingTable)
      .where(eq(healthTrackingTable.patientId, userId))
      .orderBy(desc(healthTrackingTable.createdAt));
    
    res.json({ ok: true, entries });
  } catch (error) {
    console.error('Error fetching health tracking entries:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch health tracking entries' });
  }
});

// POST /api/track - Create a new health tracking entry
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const { painLevel, energyLevel, notes } = req.body;

    // Validation
    if (!painLevel || typeof painLevel !== 'number' || painLevel < 1 || painLevel > 10) {
      return res.status(400).json({ ok: false, error: 'Pain level must be a number between 1 and 10' });
    }
    if (!energyLevel || typeof energyLevel !== 'number' || energyLevel < 1 || energyLevel > 10) {
      return res.status(400).json({ ok: false, error: 'Energy level must be a number between 1 and 10' });
    }
    if (notes !== undefined && typeof notes !== 'string') {
      return res.status(400).json({ ok: false, error: 'Notes must be a string' });
    }

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
    console.error('Error creating health tracking entry:', error);
    res.status(500).json({ ok: false, error: 'Failed to create health tracking entry' });
  }
});

export default router;

