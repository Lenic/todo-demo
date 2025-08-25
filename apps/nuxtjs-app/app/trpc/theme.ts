import { EThemeColor } from '@todo/interface';
import { z } from 'zod';

import { setThemeColor } from '../actions';

import { procedure, router } from './core';

export const theme = router({
  setThemeColor: procedure.input(z.object({ color: z.enum(EThemeColor) })).mutation(async ({ input }) => {
    await setThemeColor(input.color);
  }),
});
