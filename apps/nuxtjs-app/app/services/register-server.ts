import { register } from '@todo/container';
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

export const registerServerServices = () => {
  register(IPostgreSQLConnectionService, PostgreSQLConnectionService, []);
  register(IAuthAdapter, DrizzleAdapter, [IPostgreSQLConnectionService]);
  register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
  register(IDBDataStorageService, PostgreSQLDataStorageService, [IPostgreSQLConnectionService]);

  register(IThemeService, ThemeService);
};
