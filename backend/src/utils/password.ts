import bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPassword(plainPassword: string, saltRounds: number = DEFAULT_SALT_ROUNDS): Promise<string> {
  if (!plainPassword) {
    throw new Error('Password is required');
  }
  return await bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
}



