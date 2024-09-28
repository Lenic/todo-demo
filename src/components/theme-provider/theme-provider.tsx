import type { FC } from 'react';
import type { Subscription } from 'rxjs';
import type { Theme, ThemeProviderProps } from './types';

import { useEffect, useRef, useState } from 'react';

import { preferColorScheme$, ThemeProviderContext } from './constants';

export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children, defaultTheme = 'system', storageKey = 'vite-ui-theme', ...rest } = props;
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (root.classList.contains(theme)) return;

    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      subscriptionRef.current = preferColorScheme$.subscribe((currentTheme) => {
        if (root.classList.contains(currentTheme)) return;

        root.classList.remove('light', 'dark');
        root.classList.add(currentTheme);
      });
    } else {
      root.classList.add(theme);
    }

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...rest} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
