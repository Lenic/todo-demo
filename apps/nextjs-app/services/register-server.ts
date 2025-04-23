import { register } from '@todo/container';
import { IDataService, IDataStorageService, IThemeService } from '@todo/interface';

import {
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  PostgreSQLDataStorageService,
  SystemDictionaryService,
} from './api';
import { DataService, ThemeService } from './resources';

export function initialize() {
  register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
  register(IDataStorageService, PostgreSQLDataStorageService);
  register(ISystemDictionaryService, SystemDictionaryService);

  register(IDataService, DataService);
  register(IThemeService, ThemeService);
}
