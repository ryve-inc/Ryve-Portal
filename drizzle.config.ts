import { defineConfig } from 'drizzle-kit';
import { readFileSync, existsSync } from 'fs';

// Load .env.local or .env without needing external packages
const envFile = existsSync('.env.local') ? '.env.local' : existsSync('.env') ? '.env' : null;
if (envFile) {
  const content = readFileSync(envFile, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { config } from './lib/config';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});

