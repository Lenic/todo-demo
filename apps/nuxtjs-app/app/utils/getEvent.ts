import type { IContainerIdentifier, IExternalStorage } from '@todo/container';
import type { H3Event } from 'h3';

import { AsyncLocalStorage } from 'async_hooks';

export const eventContext = new AsyncLocalStorage<H3Event>();

export function getEvent() {
  const event = eventContext.getStore();
  if (event) return event;

  try {
    return useRequestEvent() ?? useEvent();
  } catch {
    try {
      return useEvent();
    } catch {
      throw new Error('[Request Event]: can not find the event.');
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = new WeakMap<object, Map<IContainerIdentifier, any>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clearCachedInstanceFromMap(map: Map<IContainerIdentifier, any>) {
  for (const item of map.values()) {
    item?.dispose?.();
  }
  map.clear();
}
const registry = new FinalizationRegistry(clearCachedInstanceFromMap);

export const eventStorage: IExternalStorage = {
  getMap() {
    const event = getEvent();
    let map = store.get(event);
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map = new Map<IContainerIdentifier, any>();
      store.set(event, map);
      registry.register(event, map);
      event.node.res.on('close', () => {
        const map = store.get(event);
        if (!map) return;

        clearCachedInstanceFromMap(map);
        store.delete(event);
      });
    }
    return map;
  },
  tryGetMap() {
    const event = getEvent();
    return store.get(event);
  },
};
