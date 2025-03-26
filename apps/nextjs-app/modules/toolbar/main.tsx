'use client';

import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/controllers';
import { useEffect } from 'react';

export function Toolbar() {
  useEffect(() => {
    ServiceLocator.default.get(IThemeService).initialize();
  }, []);

  return (
    <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">Foo</div>
  );
}
