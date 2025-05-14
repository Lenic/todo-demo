'use server';

import { auth } from '@/auth';

import { BackToTodo } from './components/back-to-todo';
import { LanguageToggle } from './components/language-toggle';
import { ThemeColorToggle } from './components/theme-color-toggle';
import { ThemeToggle } from './components/theme-toggle';
import { UserButton } from './components/user-button';

export async function Toolbar() {
  const session = await auth();

  return (
    <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
      {!session?.user ? null : <BackToTodo />}
      <LanguageToggle />
      <ThemeToggle />
      <ThemeColorToggle />
      {!session?.user ? null : <UserButton user={session.user} />}
    </div>
  );
}
