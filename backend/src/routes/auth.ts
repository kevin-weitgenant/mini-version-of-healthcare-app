import express, { Request, Response } from 'express';
import { db } from '../config/db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '../utils/password';
import { signAccessToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';
import { 
  asyncHandler, 
  ValidationError, 
  ConflictError, 
  AuthenticationError,
  DatabaseError 
} from '../utils/errorHandler';

const router = express.Router();

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};

  // Input validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new ValidationError('Name is required');
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new ValidationError('Valid email is required');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check for duplicate email
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
    if (existing.length > 0) {
      throw new ConflictError('Email already registered');
    }

    const hashed = await hashPassword(password);

    const inserted = await db.insert(usersTable).values({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
    }).returning();

    const user = inserted[0];
    const token = signAccessToken({ sub: user.id, email: user.email, name: user.name });

    res.status(201).json({ 
      ok: true,
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    // Re-throw known errors
    if (error instanceof ConflictError || error instanceof ValidationError) {
      throw error;
    }
    // Wrap database errors
    throw new DatabaseError('Registration failed', error as Error);
  }
}));

router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  
  // Input validation
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new ValidationError('Valid email is required');
  }
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
    const user = users[0];
    
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = signAccessToken({ sub: user.id, email: user.email, name: user.name });
    res.json({ 
      ok: true,
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    // Re-throw known errors
    if (error instanceof ValidationError || error instanceof AuthenticationError) {
      throw error;
    }
    // Wrap database errors
    throw new DatabaseError('Login failed', error as Error);
  }
}));

router.get('/me', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Unauthorized');
  }

  res.json({ 
    ok: true,
    user: { id: req.user.id, name: req.user.name, email: req.user.email } 
  });
}));

export default router;



