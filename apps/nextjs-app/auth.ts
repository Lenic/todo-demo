import '@/services/register-server';

import { ServiceLocator } from '@todo/container';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

import { INextAuthAdapter } from '@/services/api';

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
  adapter: ServiceLocator.default.get(INextAuthAdapter),
});
