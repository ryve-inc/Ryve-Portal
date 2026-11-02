import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config, isDatabaseConfigured } from '../config';

// Global connection cache for Next.js hot-reloading
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Initialize postgres client connection
const conn =
  globalForDb.conn ??
  postgres(config.databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: config.databaseUrl.includes('supabase') ? 'require' : undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
export { schema };
export { isDatabaseConfigured };
