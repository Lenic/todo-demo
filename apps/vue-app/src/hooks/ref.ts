import type { Observable } from 'rxjs';
import type { Ref } from 'vue';

import { Subject } from 'rxjs';
import { onBeforeUnmount, ref, watch } from 'vue';

export function useRef<T>(): readonly [Ref<T | undefined>, Observable<T | undefined>];
export function useRef<T>(defaultValue: T): readonly [Ref<T>, Observable<T>];

export function useRef<T>(defaultValue?: T) {
  const valueRef = ref<T | undefined>(defaultValue);
  const valueTrigger = new Subject<T | undefined>();

  watch(
    valueRef,
    (value) => {
      valueTrigger.next(value as T | undefined);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    valueTrigger.complete();
  });

  return [valueRef, valueTrigger.asObservable()] as const;
}
