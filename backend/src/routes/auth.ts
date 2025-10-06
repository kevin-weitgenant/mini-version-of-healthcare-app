import express from 'express';
import { db } from '../config/db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '../utils/password';
import { signAccessToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ ok: false, error: 'Invalid name' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ ok: false, error: 'Invalid password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ ok: false, error: 'Email already registered' });
    }

    const hashed = await hashPassword(password);

    const inserted = await db.insert(usersTable).values({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
    }).returning();

    const user = inserted[0];
    const token = signAccessToken({ sub: user.id, email: user.email, name: user.name });

    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(500).json({ ok: false, error: message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ ok: false, error: 'Invalid password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const users = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
    const user = users[0];
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const token = signAccessToken({ sub: user.id, email: user.email, name: user.name });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(500).json({ ok: false, error: message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    return res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(500).json({ ok: false, error: message });
  }
});

export default router;



