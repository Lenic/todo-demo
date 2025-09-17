import { ServiceLocator } from '@todo/container';
import { EThemeColor } from '@todo/interface';
import { concatMap, firstValueFrom, map, of } from 'rxjs';

import { THEME_COLOR_KEY } from '../constants';
import { ISystemDictionaryService } from '../services/api';

import { defineMethod } from './notifications';

const getService = () => ServiceLocator.default.get(ISystemDictionaryService);

export const getThemeColor = defineMethod((tool$) => {
  const service = getService();

  const color$ = tool$.pipe(
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
});

export const setThemeColor = defineMethod((tool$, theme: EThemeColor) => {
  const service = getService();

  return firstValueFrom(
    tool$.pipe(
      concatMap(({ userId, sync }) => {
        return service.get(THEME_COLOR_KEY, userId).pipe(
          concatMap((item) => {
            if (item) {
              return item.value === (theme as string)
                ? of(0)
                : service.update({ ...item, value: theme, updatedBy: userId });
            }

            return service.add({
              key: THEME_COLOR_KEY,
              value: theme,
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
});
