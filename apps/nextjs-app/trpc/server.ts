import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCContext = t.context;
export const router = t.router;
export const publicProcedure = t.procedure;
