'use client';

import type { Observable } from 'rxjs';

import { useEffect } from 'react';

export function useObservableEffect<T>(source$: Observable<T>, callback: (args: T) => void) {
  useEffect(() => {
    const subscription = source$.subscribe(callback);

    return () => {
      subscription.unsubscribe();
    };
  }, [source$, callback]);
}
