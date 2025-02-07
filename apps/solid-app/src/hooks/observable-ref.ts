import type { Observable } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { onCleanup } from 'solid-js';

export function useObservableRef<T>(): [(val: T) => void, Observable<T | undefined>] {
  const eventTrigger = new BehaviorSubject<T | undefined>(undefined);

  const handleSetElement = (val: T) => {
    eventTrigger.next(val);
  };

  onCleanup(() => {
    eventTrigger.complete();
  });

  return [handleSetElement, eventTrigger];
}
