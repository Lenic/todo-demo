import type { Observable } from 'rxjs';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  timer,
  withLatestFrom,
} from 'rxjs';

export const useLoading = <T>(fn: (args: T) => Promise<unknown> | Observable<unknown>, delayTime = 300) => {
  const [loading, setLoading] = useState(false);
  const eventArgsRef = useRef(new Subject<T>());

  const actionRef = useRef(new ReplaySubject<(args: T) => Promise<unknown> | Observable<unknown>>(1));
  useEffect(() => {
    actionRef.current.next(fn);
  }, [fn]);

  useEffect(() => {
    const subscription = eventArgsRef.current
      .pipe(
        withLatestFrom(actionRef.current),
        exhaustMap(([eventArgs, action]) => {
          const waiter = action(eventArgs);
          const waiter$ = waiter instanceof Promise ? from(waiter) : waiter;

          const false$ = waiter$.pipe(
            map(() => false),
            catchError(() => of(false)),
            share(),
          );

          return merge(false$, race(false$, timer(delayTime).pipe(map(() => true))));
        }),
      )
      .subscribe((loading) => {
        setLoading(loading);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [delayTime]);

  const handleEvent = useCallback((args: T) => {
    eventArgsRef.current.next(args);
  }, []);

  return [loading, handleEvent] as const;
};
