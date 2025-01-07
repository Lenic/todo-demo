import type { Observable } from 'rxjs';
import type { Ref, ShallowRef, WatchOptions } from 'vue';

import { Subject } from 'rxjs';
import { onBeforeUnmount, watch } from 'vue';

export function useObservableWatch<T, Immediate extends Readonly<boolean> = true>(
  inputRef: Ref<T> | ShallowRef<T>,
  options?: WatchOptions<Immediate>,
): Observable<T> {
  const refTrigger = new Subject<T>();
  watch(
    inputRef,
    (el) => {
      refTrigger.next(el);
    },
    { immediate: true, ...options },
  );

  onBeforeUnmount(() => {
    refTrigger.complete();
  });

  return refTrigger;
}
