import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return opts;
};

export type TContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<TContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
