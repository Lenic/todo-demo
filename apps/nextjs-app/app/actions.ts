'use server';

import { ServiceLocator } from '@todo/container';
import { ETheme, EThemeColor } from '@todo/interface';
import { concatMap, firstValueFrom, map, of } from 'rxjs';

import { ISystemDictionaryService } from '@/services/api';

const THEME_KEY = 'SYSTEM_THEME';
const THEME_COLOR_KEY = 'SYSTEM_THEME_COLOR';

export async function getTheme() {
  const service = ServiceLocator.default.get(ISystemDictionaryService);

  const theme$ = service.get(THEME_KEY).pipe(
    concatMap((item) => {
      if (item) return of(item);

      return service.add({
        key: THEME_KEY,
        value: ETheme.SYSTEM,
      });
    }),
    map((item) => item.value as ETheme),
  );

  return firstValueFrom(theme$);
}

export async function setTheme(theme: ETheme) {
  const service = ServiceLocator.default.get(ISystemDictionaryService);

  const theme$ = service.get(THEME_KEY).pipe(
    concatMap((item) => {
      if (item) {
        return item.value === theme.toString() ? of(0) : service.update({ ...item, value: theme });
      }

      return service.add({
        key: THEME_KEY,
        value: theme,
      });
    }),
    map(() => void 0),
  );

  return firstValueFrom(theme$);
}

export async function getThemeColor() {
  const service = ServiceLocator.default.get(ISystemDictionaryService);

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
  const service = ServiceLocator.default.get(ISystemDictionaryService);

  const theme$ = service.get(THEME_COLOR_KEY).pipe(
    concatMap((item) => {
      if (item) {
        return item.value === theme.toString() ? of(0) : service.update({ ...item, value: theme });
      }

      return service.add({
        key: THEME_COLOR_KEY,
        value: theme,
      });
    }),
    map(() => void 0),
  );

  return firstValueFrom(theme$);
}
