import NeonAdapter from '@auth/neon-adapter';
import { Pool } from '@neondatabase/serverless';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

/**
 * SQL: https://authjs.dev/getting-started/adapters/neon
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: { logo: '/logo.png' },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  // debug: true,
  secret: process.env.AUTH_SECRET,
  adapter: NeonAdapter(pool),
});
