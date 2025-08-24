import type { Observable } from 'rxjs';

import { catchError, filter, from, map, merge, of, race, share, take, tap, timer, zip } from 'rxjs';

/**
 * add processing state to a async action.
 *
 * @param fn - the async action.
 * @param processingCallback - the callback occurs when the processing state is changed.
 * @param delay - The delay period applied after the processing state changes for the first time.
 * If the processing state changes again within this delay period, the `processingCallback` wouldn't be triggered.
 */
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

  return zip([waiter$, loading$]).pipe(map((v) => v[0]));
};
