import type { IThemeProviderState } from './types';

import { useContext } from 'react';

import { ThemeProviderContext } from './constants';

export const useTheme = () => {
  const context = useContext(ThemeProviderContext) as IThemeProviderState | undefined;

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
