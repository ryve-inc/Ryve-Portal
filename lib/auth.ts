import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { config } from './config';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: config.betterAuthSecret,
  baseURL: config.betterAuthUrl,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

export async function getCurrentUser(reqHeaders?: Headers) {
  try {
    const session = await auth.api.getSession({
      headers: reqHeaders || new Headers(),
    });
    return session?.user || null;
  } catch {
    return null;
  }
}

