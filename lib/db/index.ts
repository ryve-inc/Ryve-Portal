import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
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

// Auto-ensure tables and columns exist in Neon PostgreSQL
let tablesReady = false;

export async function ensureTables() {
  if (tablesReady) return;
  try {
    // 1. Ensure organizations table has user_id
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS organizations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        user_id text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await db.execute(sql`
      ALTER TABLE organizations ADD COLUMN IF NOT EXISTS user_id text;
    `);

    // 2. Ensure nodes table exists with all required columns
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS nodes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id uuid,
        capacity_gb double precision NOT NULL DEFAULT 1,
        network_address text NOT NULL DEFAULT '127.0.0.1:9000',
        duration_months integer NOT NULL DEFAULT 1,
        purchased_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL DEFAULT now(),
        status text NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS capacity_gb double precision;
    `);
    await db.execute(sql`
      ALTER TABLE nodes ALTER COLUMN capacity_gb TYPE double precision;
    `);
    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS network_address text;
    `);
    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS network_id text;
    `);
    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS duration_months integer DEFAULT 1;
    `);
    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS purchased_at timestamptz DEFAULT now();
    `);
    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS expires_at timestamptz;
    `);
    await db.execute(sql`
      ALTER TABLE nodes ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
    `);

    tablesReady = true;
  } catch {
    // Graceful fallback if already running or schema exists
  }
}

export { schema };
export { isDatabaseConfigured };
