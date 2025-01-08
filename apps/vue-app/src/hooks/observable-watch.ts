import type { Observable } from 'rxjs';
import type { Ref, ShallowRef, WatchOptions } from 'vue';

import { ReplaySubject } from 'rxjs';
import { onBeforeUnmount, watch } from 'vue';

export function useObservableWatch<T, Immediate extends Readonly<boolean> = true>(
  inputRef: Ref<T> | ShallowRef<T> | (() => T),
  options?: WatchOptions<Immediate>,
): Observable<T> {
  const refTrigger = new ReplaySubject<T>();
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
