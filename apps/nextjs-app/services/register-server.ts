import { register } from '@todo/container';
import { IDataStorageService } from '@todo/interface';

import {
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  PostgreSQLDataStorageService,
  SystemDictionaryService,
} from './api';

register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
register(IDataStorageService, PostgreSQLDataStorageService, [IPostgreSQLConnectionService]);
register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
