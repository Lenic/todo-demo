'use client';

import { useCallback } from 'react';

import { trpc } from '@/trpc/client';

export function Hello() {
  const handleClick = useCallback(() => {
    trpc.getUser.query().then(
      (result) => {
        console.table(result);
      },
      (e: unknown) => {
        console.error(e);
      },
    );
  }, []);

  return (
    <div>
      <div>Hello Component</div>
      <button onClick={handleClick}>Get User</button>
    </div>
  );
}
