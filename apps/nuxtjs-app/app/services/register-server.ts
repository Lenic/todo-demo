import { ContainerLifetimeTypes, ExternalLifetime, ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { eventStorage } from '~/utils/getEvent';

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
import { DataService, IDBDataService } from './resources';

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
  ServiceLocator.default.container.set(IDBDataService, { creator: DataService, dependencies: [] });
};
