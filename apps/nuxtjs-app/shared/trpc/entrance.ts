import { router } from './core';
import locale from './locale';

export const appRouter = router({
  locale,
});

export type AppRouter = typeof appRouter;
