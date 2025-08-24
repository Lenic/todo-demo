import type { Observable } from 'rxjs';

import { exhaustMap, Subject } from 'rxjs';
import { ref } from 'vue';

import { loading } from '~/lib/loading';

import { useObservableEffect } from './observable-effect';

export function useAsyncEvent<T>(
  fn: (event: T) => Promise<unknown> | Observable<unknown>,
  delay?: number,
): [(args: T) => void, Ref<boolean>];

export function useAsyncEvent<T>(
  fn: (event: T, context: Record<string, unknown>) => Promise<unknown> | Observable<unknown>,
  processingCallback: (processing: boolean, context: Record<string, unknown>) => void,
  delay?: number,
): [(args: T) => void, Ref<boolean>];

export function useAsyncEvent<T>(fn: any, processingCallbackOrDelay?: any, delay?: number): any {
  let delayTime = 300;
  let callback: ((processing: boolean, context: Record<string, unknown>) => void) | null = null;

  if (typeof processingCallbackOrDelay === 'number') {
    delayTime = processingCallbackOrDelay;
  } else if (processingCallbackOrDelay) {
    callback = processingCallbackOrDelay;
  }

  if (typeof delay !== 'undefined') {
    delayTime = delay;
  }

  const eventTrigger = new Subject<T>();
  const handleEvent = (args: T) => {
    eventTrigger.next(args);
  };

  const loadingRef = ref(false);
  const context: Record<string, unknown> = {};
  useObservableEffect(
    eventTrigger.pipe(
      exhaustMap((eventArgs) =>
        loading(
          () =>
            typeof processingCallbackOrDelay === 'function'
              ? (fn as (event: T, context: Record<string, any>) => Promise<unknown> | Observable<unknown>)(
                  eventArgs,
                  context,
                )
              : (fn as (event: T) => Promise<unknown> | Observable<unknown>)(eventArgs),

          (processing) => {
            loadingRef.value = processing;

            callback?.(processing, context);
          },
          delayTime,
        ),
      ),
    ),
  );

  return [handleEvent, loadingRef] as const;
}
