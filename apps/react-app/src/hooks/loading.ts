import { useCallback, useEffect, useRef, useState } from 'react';
import { catchError, combineLatest, exhaustMap, from, map, merge, of, race, share, Subject, timer } from 'rxjs';

export const useLoading = <T>(delayTime = 300) => {
  const [loading, setLoading] = useState(false);
  const eventArgsRef = useRef(new Subject<T>());
  const actionRef = useRef(new Subject<(args: T) => Promise<unknown>>());

  useEffect(() => {
    const subscription = combineLatest([actionRef.current, eventArgsRef.current])
      .pipe(
        exhaustMap(([action, eventArgs]) => {
          const waiter = action(eventArgs);
          const false$ = from(waiter).pipe(
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
  }, []);

  const handleEvent = useCallback((args: T) => {
    eventArgsRef.current.next(args);
  }, []);

  const handleAction = useCallback((fn: (args: T) => Promise<unknown>) => {
    actionRef.current.next(fn);
  }, []);

  return [loading, handleEvent, handleAction] as const;
};
