import type { Subscriber } from 'rxjs';

import { Observable } from 'rxjs';
import { effectScope } from 'vue';

export function hook$<T>(action: (observer: Subscriber<T>) => void) {
  return new Observable<T>((observer) => {
    const scope = effectScope(true);

    const cleanupFn = scope.run(() => {
      action(observer);

      return () => {
        observer.complete();
      };
    });

    return () => {
      scope.stop();
      cleanupFn?.();
    };
  });
}
