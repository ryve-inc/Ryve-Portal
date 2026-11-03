/**
 * Ryve Portal Server Configuration
 * 
 * Strict Server-Side Configuration:
 * - NO NEXT_PUBLIC keys exposed to browser
 * - Database and Auth credentials configured with secure fallbacks
 */

export const config = {
  // Database Connection URL (PostgreSQL / Supabase)
  databaseUrl:
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://postgres:postgres@localhost:5432/ryve',

  // Better Auth Secret (32+ character key)
  betterAuthSecret:
    process.env.BETTER_AUTH_SECRET ||
    'ryve_sec_e8b417c8096f264d95a14032d887a419c836997230b4d47fbff2ad0964db2a99',

  betterAuthUrl:
    process.env.BETTER_AUTH_URL ||
    'http://localhost:3000',

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
