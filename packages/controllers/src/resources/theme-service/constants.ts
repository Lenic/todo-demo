import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ETheme } from './types';
import { EThemeColor } from './types';

export const DEFAULT_THEME = ETheme.SYSTEM;
export const THEME_STORAGE_KEY = 'UI-THEME';
export const DEFAULT_THEME_COLOR = EThemeColor.NEUTRAL;
export const THEME_COLOR_STORAGE_KEY = 'UI-THEME-COLOR';

export const THEME_COLOR_LIST: EThemeColor[] = [
  EThemeColor.BLUE,
  EThemeColor.GREEN,
  EThemeColor.NEUTRAL,
  EThemeColor.YELLOW,
];

export const preferColorScheme$ = new Observable<Exclude<ETheme, 'system'>>((observer) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  observer.next(mediaQuery.matches ? ETheme.DARK : ETheme.LIGHT);

  const handleThemeChange = (e: MediaQueryListEvent) => {
    observer.next(e.matches ? ETheme.DARK : ETheme.LIGHT);
  };

  mediaQuery.addEventListener('change', handleThemeChange);
  return () => {
    observer.complete();
    mediaQuery.removeEventListener('change', handleThemeChange);
  };
}).pipe(shareReplay(1));
