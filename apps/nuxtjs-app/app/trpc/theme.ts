import { EThemeColor } from '@todo/interface';
import { z } from 'zod';

import { setThemeColor } from '../actions';

import { procedure, router } from './core';

export const theme = router({
  setThemeColor: procedure.input(z.object({ color: z.enum(EThemeColor) })).mutation(async ({ input, ctx }) => {
    await setThemeColor(ctx.headers, ctx.session)(input.color);
  }),
});
