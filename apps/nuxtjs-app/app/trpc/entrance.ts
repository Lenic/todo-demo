import { router } from './core';
import { theme } from './theme';
import { todo } from './todo';

export const appRouter = router({
  theme,
  todo,
});

export type AppRouter = typeof appRouter;
