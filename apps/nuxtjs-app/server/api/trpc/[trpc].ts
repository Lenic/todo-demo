import type { Session } from '@auth/core/types';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '~/trpc';

export default defineEventHandler(async (event) => {
  const req = toWebRequest(event);

  const session = await $fetch<Session | null>('/api/auth/session', { headers: req.headers });
  return fetchRequestHandler({
    req,
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (opts) => ({ ...opts, session, headers: req.headers }),
  });
});
