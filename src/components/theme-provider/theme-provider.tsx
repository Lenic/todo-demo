import type { FC } from 'react';
import type { Theme, ThemeProviderProps } from './types';

import { useEffect, useState } from 'react';

import { ThemeProviderContext } from './constants';

export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children, defaultTheme = 'system', storageKey = 'vite-ui-theme', ...rest } = props;
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
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
