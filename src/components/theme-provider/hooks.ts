import { useContext, useEffect, useMemo } from 'react';
import { ReplaySubject } from 'rxjs';

import { ThemeProviderContext } from './constants';

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export const usePreferColorScheme = () => {
  const notification$ = useMemo(() => new ReplaySubject<'light' | 'dark'>(1), []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    notification$.next(mediaQuery.matches ? 'dark' : 'light');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        notification$.next('dark');
      } else {
        notification$.next('light');
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => {
      notification$.complete();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [notification$]);

  return notification$;
};
