import { z } from 'zod';
import { COOKIE_NAME, ELocaleType, language$ } from '@/i18n';
import { firstValueFrom, tap } from 'rxjs';

import { router, procedure } from './core';

export default router({
  updateLocale: procedure.input(z.object({ locale: z.enum(ELocaleType) })).mutation(async ({ input, ctx }) => {
    await firstValueFrom(
      language$.pipe(
        tap((locale) => {
          if (input.locale !== locale) {
            ctx.resHeaders.append('set-cookie', `${COOKIE_NAME}=${input.locale}; Path=/; Secure; SameSite=Lax`);
          }
        }),
      ),
    );
  }),
});
