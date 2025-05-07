'use client';

import type { Observable } from 'rxjs';

import { useEffect, useMemo, useRef, useState } from 'react';

export const defaultEqualComparer = <T>(prev: T, next: T) => prev === next;

export function useObservableState<T>(
  source$: Observable<T>,
  valueOrGetter: T | (() => T),
  comparer: (prev: T, next: T) => boolean = defaultEqualComparer,
) {
  const [state, setState] = useState(valueOrGetter);
  const currentValueRef = useRef(state);

  const subscription = useMemo(
    () =>
      source$.subscribe((value) => {
        if (comparer(currentValueRef.current, value)) return;

        currentValueRef.current = value;
        setState(value);
      }),
    [source$, comparer],
  );

  useEffect(
    () => () => {
      subscription.unsubscribe();
    },
    [subscription],
  );

  return state;
}
