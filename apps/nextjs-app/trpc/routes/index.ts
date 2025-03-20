import { z } from 'zod';

import { publicProcedure, router } from '../server';

export const appRouter = router({
  getUser: publicProcedure.input(z.string()).query(({ input }) => {
    return { id: new Date(), name: 'John Doe', description: input };
  }),
});

export type AppRouter = typeof appRouter;
