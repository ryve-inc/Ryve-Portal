/**
 * Ryve Portal Server Configuration
 * 
 * Strict Server-Side Configuration:
 * - NO NEXT_PUBLIC keys (prevents exposing connection strings or API keys to the browser)
 * - All database credentials and connection strings are managed in this TypeScript module
 */

export const config = {
  // Database Connection URL (Supabase PostgreSQL / Direct Postgres)
  // Example Supabase connection string:
  // "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
  databaseUrl:
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://postgres:postgres@localhost:5432/ryve',

  // Tenant Defaults
  defaultOrgId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  defaultOrgName: 'SJCET Distributed Labs',
  defaultOrgSlug: 'sjcet-labs',

  // Storage Pricing (Per TB / Month in USD)
  ryveStoragePricePerTb: 4.0,

  // Node Gossip & Monitoring
  heartbeatIntervalSec: 10,
  defaultRedundancyPolicy: 'Reed-Solomon (8+4)',
  encryptionStandard: 'AES-256-GCM Zero-Knowledge',
};

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL || 
  process.env.SUPABASE_DB_URL || 
  process.env.POSTGRES_URL
);
