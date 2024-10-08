import type { Observable } from 'rxjs';

import { useEffect, useState } from 'react';

export function useObservableState<T>(source$: Observable<T>): T | undefined;
export function useObservableState<T>(source$: Observable<T>, valueOrGetter: T | (() => T)): T;

export function useObservableState<T>(source$: Observable<T>, valueOrGetter?: T | (() => T)) {
  const [state, setState] = useState(valueOrGetter);

  useEffect(() => {
    const subscription = source$.subscribe(setState);
    return () => {
      subscription.unsubscribe();
    };
  }, [source$]);

  return state;
}
