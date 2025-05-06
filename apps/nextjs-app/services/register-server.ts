'use server';

import { register } from '@todo/container';

import {
  DrizzleAdapter,
  IDBDataStorageService,
  INextAuthAdapter,
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  PostgreSQLDataStorageService,
  SystemDictionaryService,
} from './api';

register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
register(INextAuthAdapter, DrizzleAdapter, [IPostgreSQLConnectionService]);
register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
register(IDBDataStorageService, PostgreSQLDataStorageService, [IPostgreSQLConnectionService]);
