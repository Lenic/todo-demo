import type { Observable } from 'rxjs';
import type { Accessor } from 'solid-js';

import { Subject } from 'rxjs';
import { createEffect, on, onMount } from 'solid-js';

export enum EUpdateType {
  ALL = 3,
  MOUNTED = 1,
  UPDATED = 2,
}

export function useUpdate(): Observable<EUpdateType>;
export function useUpdate<T>(
  updateType: Exclude<EUpdateType, EUpdateType.MOUNTED>,
  target: Accessor<T>,
): Observable<EUpdateType>;

export function useUpdate<T>(updateType: EUpdateType = EUpdateType.UPDATED, target?: Accessor<T>) {
  const updateTrigger = new Subject<EUpdateType>();

  onMount(() => {
    if (EUpdateType.MOUNTED & updateType) {
      updateTrigger.next(EUpdateType.MOUNTED);
    }
  });

  if (target) {
    createEffect(
      on(
        target,
        () => {
          if (EUpdateType.UPDATED & updateType) {
            updateTrigger.next(EUpdateType.UPDATED);
          }
        },
        { defer: true },
      ),
    );
  }

  return updateTrigger;
}
