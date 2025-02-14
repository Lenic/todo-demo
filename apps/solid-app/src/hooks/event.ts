import type { Observable } from 'rxjs';

import { Subject } from 'rxjs';
import { onCleanup } from 'solid-js';

export function useEvent<T extends Event = Event>(action?: (observable: Observable<T>) => Observable<unknown>) {
  const eventTrigger = new Subject<T>();
  const handleEvent = (e: T) => {
    eventTrigger.next(e);
  };

  const subscription = action?.(eventTrigger).subscribe();
  onCleanup(() => {
    eventTrigger.complete();
    subscription?.unsubscribe();
  });

  return [handleEvent, eventTrigger.asObservable()] as const;
}
