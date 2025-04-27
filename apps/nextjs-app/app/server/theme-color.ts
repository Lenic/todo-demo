'use server';

import { ServiceLocator } from '@todo/container';
import { EThemeColor } from '@todo/interface';
import { combineLatest, concatMap, firstValueFrom, map, of } from 'rxjs';

import { THEME_COLOR_KEY } from '@/constants';
import { ISystemDictionaryService } from '@/services/api';

import { publish } from './notifications';

const getService = () => ServiceLocator.default.get(ISystemDictionaryService);

export async function getThemeColor() {
  const service = getService();

  const color$ = service.get(THEME_COLOR_KEY).pipe(
    concatMap((item) => {
      if (item) return of(item);

      return service.add({
        key: THEME_COLOR_KEY,
        value: EThemeColor.NEUTRAL,
      });
    }),
    map((item) => item.value as EThemeColor),
  );

  return firstValueFrom(color$);
}

export async function setThemeColor(theme: EThemeColor) {
  const service = getService();

  return firstValueFrom(
    combineLatest([
      service.get(THEME_COLOR_KEY).pipe(
        concatMap((item) => {
          if (item) {
            return item.value === theme.toString() ? of(0) : service.update({ ...item, value: theme });
          }

          return service.add({
            key: THEME_COLOR_KEY,
            value: theme,
          });
        }),
      ),
      publish(),
    ]).pipe(
      concatMap(([item, fn]) =>
        typeof item === 'number' ? of(void 0) : fn({ type: 'set-system-dictionary-item', item }, void 0),
      ),
    ),
  );
}
