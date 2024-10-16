import type { Observable } from 'rxjs';

import { useEffect } from 'react';

export function useObservableEffect<T>(source$: Observable<T>, selector: (value: T) => void) {
  useEffect(() => {
    const subscription = source$.subscribe((value) => {
      selector(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selector, source$]);
}
