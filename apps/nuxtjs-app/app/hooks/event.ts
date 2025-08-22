import type { Observable } from 'rxjs';

import { Subject } from 'rxjs';
import { onBeforeUnmount } from 'vue';

export function useEvent<T extends Event = Event>(action?: (observable: Observable<T>) => Observable<unknown>) {
  const eventTrigger = new Subject<T>();
  const handleEvent = (e: T) => {
    eventTrigger.next(e);
  };

  const subscription = action?.(eventTrigger).subscribe();
  onBeforeUnmount(() => {
    eventTrigger.complete();
    subscription?.unsubscribe();
  });

  return [handleEvent, eventTrigger.asObservable()] as const;
}
