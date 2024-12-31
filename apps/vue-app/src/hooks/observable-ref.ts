import type { Ref } from 'vue';

import { BehaviorSubject, type Observable } from 'rxjs';
import { onBeforeUnmount, ref } from 'vue';

export function useObservableRef<T>(observable: BehaviorSubject<T>): Ref<T>;
export function useObservableRef<T>(observable: Observable<T>): Ref<T | undefined>;
export function useObservableRef<T>(observable: Observable<T>, defaultValue: T): Ref<T>;

export function useObservableRef<T>(observable: Observable<T>, defaultValue?: T) {
  const observableRef = ref(observable instanceof BehaviorSubject ? (observable.getValue() as T) : defaultValue);

  const subscription = observable.subscribe((value) => void (observableRef.value = value));
  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });

  return observableRef;
}
