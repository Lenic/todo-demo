import { register } from '@todo/container';

import {
  DrizzleAdapter,
  IAuthAdapter,
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  SystemDictionaryService,
} from './api';

export const registerServerServices = () => {
  register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
  register(IAuthAdapter, DrizzleAdapter, [IPostgreSQLConnectionService]);
  register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
};
