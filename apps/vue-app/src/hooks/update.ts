import { Subject } from 'rxjs';
import { onMounted, onUpdated } from 'vue';

export enum EUpdateType {
  ALL = 3,
  MOUNTED = 1,
  UPDATED = 2,
}

export function useUpdate(updateType: EUpdateType = EUpdateType.UPDATED) {
  const updateTrigger = new Subject<EUpdateType>();

  onMounted(() => {
    if (EUpdateType.MOUNTED & updateType) {
      updateTrigger.next(EUpdateType.MOUNTED);
    }
  });

  onUpdated(() => {
    if (EUpdateType.UPDATED & updateType) {
      updateTrigger.next(EUpdateType.UPDATED);
    }
  });

  return updateTrigger.asObservable();
}
