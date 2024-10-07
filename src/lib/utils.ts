import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WindowSize {
  width: number;
  height: number;
}

const getWindowSize = () => ({ width: window.innerWidth, height: window.innerHeight }) as WindowSize;

export const windowResize$ = fromEvent(window, 'resize').pipe(
  map(() => getWindowSize()),
  startWith(getWindowSize()),
);
