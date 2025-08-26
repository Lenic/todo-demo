import { EThemeColor } from '@todo/interface';
import { z } from 'zod';

import { setThemeColor } from '../actions';

import { procedure, router } from './core';

export const theme = router({
  setThemeColor: procedure.input(z.object({ color: z.enum(EThemeColor) })).mutation(async ({ input, ctx }) => {
    const headers = Array.from(ctx.req.headers.entries()).reduce<Record<string, string>>((acc, x) => {
      acc[x[0]] = x[1];
      return acc;
    }, {});
    await setThemeColor(headers, input.color);
  }),
});
