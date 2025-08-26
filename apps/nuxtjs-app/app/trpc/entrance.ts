import { router } from './core';
import { theme } from './theme';

export const appRouter = router({
  theme,
});

export type AppRouter = typeof appRouter;
