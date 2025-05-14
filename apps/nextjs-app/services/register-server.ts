'use server';

import { register } from '@todo/container';

import {
  ContactDataService,
  DrizzleAdapter,
  IContactDataService,
  IDBDataStorageService,
  INextAuthAdapter,
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  PostgreSQLDataStorageService,
  SystemDictionaryService,
} from './api';

register(IContactDataService, ContactDataService);
register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
register(INextAuthAdapter, DrizzleAdapter, [IPostgreSQLConnectionService]);
register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
register(IDBDataStorageService, PostgreSQLDataStorageService, [IPostgreSQLConnectionService]);
