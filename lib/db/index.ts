import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import { config, isDatabaseConfigured } from '../config';

// Neon connection pool cache for Next.js hot-reloading
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

// Initialize Neon serverless pool connection
const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: config.databaseUrl,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
export { isDatabaseConfigured };
