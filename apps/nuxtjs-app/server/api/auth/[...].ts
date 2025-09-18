import type { AuthConfig } from '@auth/core/types';

import { Auth } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import { ServiceLocator } from '@todo/container';
import { toWebRequest } from 'h3';

import { IAuthAdapter } from '~/services/api/drizzle-adapter';
import { registerServerServices } from '~/services/register-server';

registerServerServices();

export const authOptions: AuthConfig = {
  theme: { logo: '/logo.png' },
  basePath: '/api/auth',
  trustHost: true,
  secret: process.env.NUXT_AUTH_SECRET!,
  adapter: ServiceLocator.default.get(IAuthAdapter),
  providers: [
    GitHub({
      clientId: process.env.NUXT_AUTH_GITHUB_ID!,
      clientSecret: process.env.NUXT_AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: (params) => ({
      expires: params.session.expires,
      user: {
        id: params.user.id,
        name: params.user.name,
        email: params.user.email,
        image: params.user.image,
      },
    }),
  },
};

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  return await Auth(request, authOptions);
});
