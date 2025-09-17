import type { Session } from '@auth/core/types';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '~/trpc';

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const url = getRequestURL(event);
  const body = await readRawBody(event);

  const headers = Object.entries(req.headers).reduce((acc, [key, value]) => {
    if (!value) return acc;
    else if (typeof value === 'string') {
      acc.set(key, value);
    } else {
      value.forEach((item) => {
        acc.set(key, item);
      });
    }
    return acc;
  }, new Headers());

  const session = await $fetch<Session | null>('/api/auth/session', { headers });

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: new Request(url, {
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? body : void 0,
      method: req.method,
    }),
    router: appRouter,
    createContext: (opts) => ({ ...opts, session, headers }),
  });
});
