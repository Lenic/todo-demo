import type { Observable } from 'rxjs';
import type { Accessor } from 'solid-js';

import { BehaviorSubject } from 'rxjs';
import { createSignal, onCleanup } from 'solid-js';

export function useObservableSignal<T>(input$: BehaviorSubject<T>): Accessor<T>;
export function useObservableSignal<T>(input$: Observable<T>): Accessor<T | undefined>;
export function useObservableSignal<T>(input$: Observable<T>, defaultValue: T): Accessor<T>;

export function useObservableSignal<T>(input$: BehaviorSubject<T> | Observable<T>, defaultValue?: T) {
  const [value, setValue] = createSignal(input$ instanceof BehaviorSubject ? input$.getValue() : defaultValue);

  const subscription = input$.subscribe((nextValue) => {
    if (value() !== nextValue) {
      setValue(nextValue as ReturnType<typeof value>);
    }
  });
  onCleanup(() => {
    subscription.unsubscribe();
  });

  return value;
}
