/**
 * Ryve Portal Server Configuration
 * 
 * Strict Server-Side Configuration:
 * - NO NEXT_PUBLIC keys exposed to browser
 * - Database (Neon Serverless PostgreSQL) and Auth credentials configured with secure fallbacks
 */

function resolveDatabaseUrl(): string {
  // Read raw .env / .env.local to preserve unescaped special characters
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      const files = ['.env.local', '.env'];
      for (const file of files) {
        const fullPath = path.resolve(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const match = content.match(/^\s*(?:DATABASE_URL|NEON_DATABASE_URL|POSTGRES_URL)\s*=\s*([^\r\n#]+)/m);
          if (match && match[1]) {
            let val = match[1].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            val = val.replace(/\\\$/g, '$');
            if (val.startsWith('postgres://') || val.startsWith('postgresql://')) {
              return val;
            }
          }
        }
      }
    } catch {
      // Fallback to process.env
    }
  }

  return (
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://neondb_owner:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
  );
}

export const config = {
  // Database Connection URL (Neon Serverless PostgreSQL)
  databaseUrl: resolveDatabaseUrl(),

  // Better Auth Secret (32+ character key)
  betterAuthSecret:
    process.env.BETTER_AUTH_SECRET ||
    'ryve_sec_e8b417c8096f264d95a14032d887a419c836997230b4d47fbff2ad0964db2a99',

  betterAuthUrl:
    process.env.BETTER_AUTH_URL ||
    'http://localhost:3000',

  // Tenant Defaults
  defaultOrgId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  defaultOrgName: 'Ryve Organization',
  defaultOrgSlug: 'ryve-org',

  // Storage Pricing (Per TB / Month in USD)
  ryveStoragePricePerTb: 4.0,

  // Node Gossip & Monitoring
  heartbeatIntervalSec: 10,
  defaultRedundancyPolicy: 'Reed-Solomon (8+4)',
  encryptionStandard: 'AES-256-GCM Zero-Knowledge',
};

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL || 
  process.env.NEON_DATABASE_URL || 
  process.env.POSTGRES_URL
);
