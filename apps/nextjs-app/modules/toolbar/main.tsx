'use client';

import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/controllers';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { LanguageToggle } from './components/language-toggle';
import { ThemeColorToggle } from './components/theme-color-toggle';
import { ThemeToggle } from './components/theme-toggle';

export function Toolbar() {
  useEffect(() => {
    ServiceLocator.default.get(IThemeService).initialize();
  }, []);

  return (
    <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => {
                console.log('Undo');
              },
            },
          })
        }
      >
        Show Toast
      </Button>
      <LanguageToggle />
      <ThemeToggle />
      <ThemeColorToggle />
    </div>
  );
}
