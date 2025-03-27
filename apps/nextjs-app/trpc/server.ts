import type { Context } from './context';
import type { TItemChangedEvent } from './notifications';

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { dataNotification } from './notifications';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  sse: {
    maxDurationMs: 5 * 60 * 1_000, // 5 minutes
    ping: {
      enabled: true,
      intervalMs: 3_000,
    },
    client: {
      reconnectAfterInactivityMs: 5_000,
    },
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const updateProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.clientId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unknown client.' });
  }

  return opts.next({
    ctx: {
      broadcast(data: TItemChangedEvent) {
        dataNotification.next({ clientId: opts.ctx.clientId, data });
      },
    },
  });
});
