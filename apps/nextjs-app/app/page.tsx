'use client';

import { useCallback } from 'react';

import { Button } from '@/components/ui/button';

import { Hello } from './components/hello';

export default function Home() {
  const handleClick = useCallback(() => {
    console.log('You clicked the default button.');
  }, []);

  return (
    <div className="flex flex-col items-start gap-2 m-2">
      <Hello />
      <Button
        onClick={() => {
          handleClick();
        }}
      >
        Click Me To Print Log In Console
      </Button>
    </div>
  );
}
