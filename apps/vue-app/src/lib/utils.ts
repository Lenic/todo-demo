import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { fromEvent, map, Observable, shareReplay, startWith } from 'rxjs';
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
  shareReplay(1),
);

export const getElementResize$ = <TElement extends HTMLElement, TResult>(
  el: TElement,
  selector: (value: TElement) => TResult,
) =>
  new Observable<TResult>((observer) => {
    const listener = new ResizeObserver(() => {
      observer.next(selector(el));
    });

    listener.observe(el);
    observer.next(selector(el));

    return () => {
      listener.unobserve(el);
      listener.disconnect();
    };
  });
