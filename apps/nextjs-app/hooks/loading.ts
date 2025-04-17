'use client';

import type { Observable } from 'rxjs';

import { useCallback, useEffect, useState } from 'react';
import {
  catchError,
  exhaustMap,
  from,
  map,
  merge,
  of,
  race,
  ReplaySubject,
  share,
  Subject,
  take,
  timer,
  withLatestFrom,
} from 'rxjs';

export const useLoading = <T>(fn: (args: T) => Promise<unknown> | Observable<unknown>, delayTime = 300) => {
  const [eventArgs] = useState(() => new Subject<T>());
  const handleEvent = useCallback(
    (args: T) => {
      eventArgs.next(args);
    },
    [eventArgs],
  );

  const [actionFn] = useState(() => new ReplaySubject<(args: T) => Promise<unknown> | Observable<unknown>>(1));
  useEffect(() => {
    actionFn.next(fn);
  }, [actionFn, fn]);

  const [loading, setLoading] = useState(false);
  const [loadingTrigger] = useState(() => new Subject<boolean>());
  useEffect(() => {
    const subscription = loadingTrigger.subscribe(setLoading);
    return () => {
      subscription.unsubscribe();
    };
  }, [loadingTrigger]);

  useEffect(() => {
    const subscription = eventArgs
      .pipe(
        withLatestFrom(actionFn),
        exhaustMap(([e, fn]) => {
          const waiter = fn(e);
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
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [actionFn, delayTime, eventArgs, loadingTrigger]);

  return [loading, handleEvent, loadingTrigger] as const;
};
