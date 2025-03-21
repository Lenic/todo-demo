import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
  };
};
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
