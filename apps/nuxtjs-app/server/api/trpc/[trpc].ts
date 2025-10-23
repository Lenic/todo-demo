import type { Session } from '@auth/core/types';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '~/trpc';
import { eventContext } from '~/utils/getEvent';

export default defineEventHandler(async (event) => {
  const req = toWebRequest(event);

  const session = await $fetch<Session | null>('/api/auth/session', { headers: req.headers });
  event.context.session = session;

  return await eventContext.run(event, () =>
    fetchRequestHandler({
      req,
      router: appRouter,
      endpoint: '/api/trpc',
    }),
  );
});
