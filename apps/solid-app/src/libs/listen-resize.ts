import { fromEvent, map, Observable, shareReplay, startWith } from 'rxjs';

export function listenResize$(el: HTMLElement | undefined) {
  return new Observable<[number, number]>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const entry = entries[0];
        observer.next([entry.contentRect.width, entry.contentRect.height]);
      }
    });

    if (el) {
      resizeObserver.observe(el);
    }

    return () => {
      observer.complete();
      resizeObserver.disconnect();
    };
  });
}

const getWindowSize = () => [window.innerWidth, window.innerHeight] as [number, number];

export const windowResize$: Observable<[number, number]> = fromEvent(window, 'resize').pipe(
  startWith(null),
  map(() => getWindowSize()),
  shareReplay(1),
);
