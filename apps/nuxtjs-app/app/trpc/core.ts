import type { ITRPCContext } from './types';

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<ITRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
