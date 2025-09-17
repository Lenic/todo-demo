import type { Subscriber } from 'rxjs';

import { Observable } from 'rxjs';

export function getHookValue<T>(action: (observer: Subscriber<T>) => void) {
  return new Observable<T>((observer) => {
    const scope = effectScope(true);

    const cleanupFn = scope.run(() => {
      action(observer);

      return () => {
        observer.complete();
      };
    });

    function destroy() {
      scope.stop();
      cleanupFn?.();
    }
    observer.add(destroy);
    return destroy;
  });
}
