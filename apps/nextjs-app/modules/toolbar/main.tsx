'use client';

import '@/services/resources/theme-service';

import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';
import { useEffect } from 'react';

import { LanguageToggle } from './components/language-toggle';
import { ThemeColorToggle } from './components/theme-color-toggle';
import { ThemeToggle } from './components/theme-toggle';

export function Toolbar() {
  useEffect(() => {
    ServiceLocator.default.get(IThemeService).initialize();
  }, []);

  return (
    <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
      <LanguageToggle />
      <ThemeToggle />
      <ThemeColorToggle />
    </div>
  );
}
