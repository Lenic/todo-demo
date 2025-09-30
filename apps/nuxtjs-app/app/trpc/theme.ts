import { ServiceLocator } from '@todo/container';
import { EThemeColor } from '@todo/interface';
import { concatMap, firstValueFrom, map, of } from 'rxjs';
import { z } from 'zod';

import { THEME_COLOR_KEY } from '~/constants';
import { ISystemDictionaryService } from '~/services/api';

import { procedure, router } from './core';
import { publish } from './notifications';

const getService = () => ServiceLocator.default.get(ISystemDictionaryService);

export const theme = router({
  getThemeColor: procedure.query(() => {
    const service = getService();

    const color$ = publish().pipe(
      concatMap(({ userId }) => {
        return service.get(THEME_COLOR_KEY, userId).pipe(
          concatMap((item) => {
            if (item) return of(item);

            return service.add({
              userId,
              createdBy: userId,
              updatedBy: userId,
              key: THEME_COLOR_KEY,
              value: EThemeColor.NEUTRAL,
            });
          }),
          map((item) => item.value as EThemeColor),
        );
      }),
    );

    return firstValueFrom(color$);
  }),
  setThemeColor: procedure.input(z.object({ color: z.enum(EThemeColor) })).mutation(({ input }) => {
    const service = getService();

    return firstValueFrom(
      publish().pipe(
        concatMap(({ userId, sync }) => {
          return service.get(THEME_COLOR_KEY, userId).pipe(
            concatMap((item) => {
              if (item) {
                return item.value === (input.color as string)
                  ? of(0)
                  : service.update({ ...item, value: input.color, updatedBy: userId });
              }

              return service.add({
                key: THEME_COLOR_KEY,
                value: input.color,
                userId,
                createdBy: userId,
                updatedBy: userId,
              });
            }),
            concatMap((item) =>
              typeof item === 'number' ? of(void 0) : sync({ type: 'set-system-dictionary-item', item }, void 0),
            ),
          );
        }),
      ),
    );
  }),
});
