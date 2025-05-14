'use client';

import { CornerLeftUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function BackToTodo() {
  const pathname = usePathname();

  if (pathname.toLowerCase() !== '/contact') return null;
  return (
    <Link href="/todo">
      <Button variant="outline" size="icon">
        <CornerLeftUp className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Return To Todo</span>
      </Button>
    </Link>
  );
}
