import { register } from '@todo/container';

import {
  IDBDataStorageService,
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  PostgreSQLDataStorageService,
  SystemDictionaryService,
} from './api';

register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
register(IDBDataStorageService, PostgreSQLDataStorageService, [IPostgreSQLConnectionService]);
register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
