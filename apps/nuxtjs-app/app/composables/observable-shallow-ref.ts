import type { Observable } from 'rxjs';
import type { ShallowRef } from 'vue';

import { BehaviorSubject } from 'rxjs';
import { onBeforeUnmount, shallowRef } from 'vue';

export function useObservableShallowRef<T>(observable: BehaviorSubject<T>): ShallowRef<T>;
export function useObservableShallowRef<T>(observable: Observable<T>): ShallowRef<T | undefined>;
export function useObservableShallowRef<T>(observable: Observable<T>, defaultValue: T): ShallowRef<T>;

export function useObservableShallowRef<T>(observable: Observable<T>, defaultValue?: T) {
  const observableRef = shallowRef(observable instanceof BehaviorSubject ? (observable.getValue() as T) : defaultValue);

  const subscription = observable.subscribe((value) => void (observableRef.value = value));
  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });

  return observableRef;
}
