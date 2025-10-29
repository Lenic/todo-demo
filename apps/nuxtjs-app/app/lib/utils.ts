import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { EMPTY, fromEvent, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WindowSize {
  width: number;
  height: number;
}

const getWindowSize = () => ({ width: window.innerWidth, height: window.innerHeight }) as WindowSize;

export const windowResize$ = of(1).pipe(
  switchMap(() => {
    if (typeof window === 'undefined') return EMPTY;

    return fromEvent(window, 'resize').pipe(
      map(() => getWindowSize()),
      startWith(getWindowSize()),
    );
  }),

  shareReplay({ refCount: true, bufferSize: 1 }),
);
