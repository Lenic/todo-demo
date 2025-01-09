import { Subject } from 'rxjs';
import { onMounted, onUpdated } from 'vue';

export enum EUpdateType {
  ALL = 3,
  MOUNTED = 1,
  UPDATED = 2,
}

export function useUpdate(updateType: EUpdateType = EUpdateType.UPDATED) {
  const updateTrigger = new Subject<void>();

  onMounted(() => {
    if (EUpdateType.MOUNTED & updateType) {
      updateTrigger.next();
    }
  });

  onUpdated(() => {
    if (EUpdateType.UPDATED & updateType) {
      updateTrigger.next();
    }
  });

  return updateTrigger.asObservable();
}
