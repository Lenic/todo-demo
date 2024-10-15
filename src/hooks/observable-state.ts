import type { Observable } from 'rxjs';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const defaultEqualComparer = <T>(prev: T, next: T) => prev === next;

export function useObservableState<T>(
  source$: Observable<T>,
  valueOrGetter: T | (() => T),
  comparer: (prev: T, next: T) => boolean = defaultEqualComparer,
) {
  const [state, setState] = useState(valueOrGetter);
  const currentValueRef = useRef(state);

  useEffect(() => {
    const subscription = source$.subscribe((value) => {
      if (comparer(currentValueRef.current, value)) return;

      currentValueRef.current = value;
      setState(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [source$, comparer]);

  return state;
}

export function useObservableStore<T>(
  source$: Observable<T>,
  valueOrGetter: T | (() => T),
  comparer: (prev: T | undefined, next: T | undefined) => boolean = defaultEqualComparer,
) {
  const valueRef = useRef<T>(typeof valueOrGetter === 'function' ? (valueOrGetter as () => T)() : valueOrGetter);
  const getSnapshot = useCallback(() => valueRef.current, []);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = source$.subscribe((value) => {
        const original = valueRef.current;
        valueRef.current = value;

        if (!comparer(original, value)) {
          onStoreChange();
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    },
    [source$, comparer],
  );

  return useSyncExternalStore(subscribe, getSnapshot);
}
