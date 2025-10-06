import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Neon connection
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle instance
export const db = drizzle({ client: sql });

// Health check function
export async function checkDatabaseHealth() {
  try {
    const result = await sql`SELECT 1 as ok, NOW() as timestamp`;
    return {
      ok: true,
      result: result[0],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

// Export the sql instance for raw queries if needed
export { sql };
