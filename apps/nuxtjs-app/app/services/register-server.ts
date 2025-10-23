import {
  ContainerLifetimeTypes,
  ExternalLifetime,
  type IContainerIdentifier,
  type IExternalStorage,
  ServiceLocator,
} from '@todo/container';
import { IThemeService } from '@todo/interface';

import { ThemeService } from './resources/theme-service';
import {
  DrizzleAdapter,
  IAuthAdapter,
  IDBDataStorageService,
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  PostgreSQLDataStorageService,
  SystemDictionaryService,
} from './api';

const store = new WeakMap<object, Map<IContainerIdentifier, any>>();
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

const weakLifetime = new ExternalLifetime(eventStorage);
ServiceLocator.default.container.appendLifetimes(weakLifetime);
ServiceLocator.default.container.setDefaultLifetimeName(weakLifetime.name);

export const registerServerServices = () => {
  ServiceLocator.default.container.set(IPostgreSQLConnectionService, {
    creator: PostgreSQLConnectionService,
    dependencies: [],
    lifetimeName: ContainerLifetimeTypes.Single,
  });
  ServiceLocator.default.container.set(IAuthAdapter, {
    creator: DrizzleAdapter,
    dependencies: [IPostgreSQLConnectionService],
    lifetimeName: ContainerLifetimeTypes.Single,
  });
  ServiceLocator.default.container.set(ISystemDictionaryService, {
    creator: SystemDictionaryService,
    dependencies: [IPostgreSQLConnectionService],
  });
  ServiceLocator.default.container.set(IDBDataStorageService, {
    creator: PostgreSQLDataStorageService,
    dependencies: [IPostgreSQLConnectionService],
  });

  ServiceLocator.default.container.set(IThemeService, { creator: ThemeService, dependencies: [] });
};
