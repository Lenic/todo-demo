'use server';

import { LanguageToggle } from './components/language-toggle';
import { ThemeColorToggle } from './components/theme-color-toggle';
import { ThemeToggle } from './components/theme-toggle';
import { UserButton } from './components/user-button';

// eslint-disable-next-line @typescript-eslint/require-await -- this is the server component, must be async component.
export async function Toolbar() {
  return (
    <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
      <LanguageToggle />
      <ThemeToggle />
      <ThemeColorToggle />
      <UserButton />
    </div>
  );
}
