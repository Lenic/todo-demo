import type { ThemeProviderState } from './types';

import { createContext } from 'react';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const preferColorScheme$ = new Observable<'light' | 'dark'>((observer) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  observer.next(mediaQuery.matches ? 'dark' : 'light');

  const handleThemeChange = (e: MediaQueryListEvent) => observer.next(e.matches ? 'dark' : 'light');

  mediaQuery.addEventListener('change', handleThemeChange);
  return () => {
    observer.complete();
    mediaQuery.removeEventListener('change', handleThemeChange);
  };
}).pipe(shareReplay(1));
