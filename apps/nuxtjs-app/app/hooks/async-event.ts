import type { Observable } from 'rxjs';

import { exhaustMap, from, Subject } from 'rxjs';
import { ref } from 'vue';

import { useObservableEffect } from './observable-effect';

import { loading } from '~/lib/loading';

export const useAsyncEvent = <T>(fn: (args: T) => Promise<unknown> | Observable<unknown>, delay = 300) => {
  const eventTrigger = new Subject<T>();
  const handleEvent = (args: T) => {
    eventTrigger.next(args);
  };

  const loadingRef = ref(false);
  useObservableEffect(
    eventTrigger.pipe(
      exhaustMap((eventArgs) =>
        from(
          loading(
            () => fn(eventArgs),
            (processing) => void (loadingRef.value = processing),
            delay,
          ),
        ),
      ),
    ),
  );

  return [handleEvent, loadingRef] as const;
};
