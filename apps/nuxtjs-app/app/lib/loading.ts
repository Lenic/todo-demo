import {
  catchError,
  filter,
  firstValueFrom,
  from,
  map,
  merge,
  Observable,
  of,
  race,
  share,
  take,
  tap,
  timer,
  zip,
} from 'rxjs';

export const loading = <T>(
  fn: () => Promise<T> | Observable<T>,
  processingCallback: (processing: boolean) => void,
  delay = 300,
) => {
  const waiter = fn();
  const waiter$ = waiter instanceof Promise ? from(waiter) : waiter.pipe(take(1), share());

  const false$ = waiter$.pipe(
    map(() => false),
    catchError(() => of(false)),
    share(),
  );

  const loading$ = merge(false$, race(false$, timer(delay).pipe(map(() => true)))).pipe(
    tap(processingCallback),
    filter((v) => !v),
    take(1),
  );

  return firstValueFrom(zip([waiter$, loading$]).pipe(map((v) => v[0])));
};
