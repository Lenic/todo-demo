import type { Observable } from 'rxjs';

import { catchError, exhaustMap, from, map, merge, of, race, share, Subject, take, timer } from 'rxjs';
import { createSignal } from 'solid-js';

import { useObservableEffect } from './observable-effect';

export const useLoading = <T>(fn: (args: T) => Promise<unknown> | Observable<unknown>, delayTime = 300) => {
  const eventTrigger = new Subject<T>();
  const handleEvent = (args: T) => {
    eventTrigger.next(args);
  };

  const [loading, setLoading] = createSignal(false);
  const loadingTrigger = new Subject<boolean>();
  useObservableEffect(loadingTrigger.subscribe((loading) => void setLoading(loading)));

  useObservableEffect(
    eventTrigger
      .pipe(
        exhaustMap((eventArgs) => {
          const waiter = fn(eventArgs);
          const waiter$ = waiter instanceof Promise ? from(waiter) : waiter.pipe(take(1));

          const false$ = waiter$.pipe(
            map(() => false),
            catchError(() => of(false)),
            share(),
          );

          return merge(false$, race(false$, timer(delayTime).pipe(map(() => true))));
        }),
      )
      .subscribe((loading) => {
        loadingTrigger.next(loading);
      }),
  );

  return [loading, handleEvent, loadingTrigger] as const;
};
