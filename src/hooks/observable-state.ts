import type { Observable } from 'rxjs';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useObservableState<T>(source$: Observable<T>, defaultValue: T): [T, Dispatch<SetStateAction<T>>];
export function useObservableState<T>(
  source$: Observable<T>,
  defaultValueGetter: () => T,
): [T, Dispatch<SetStateAction<T>>];

export function useObservableState<T>(source$: Observable<T>, valueOrGetter: T | (() => T)) {
  const [state, setState] = useState(valueOrGetter);

  useEffect(() => {
    const subscription = source$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [source$]);

  return [state, setState] as const;
}
