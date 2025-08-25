import { register } from '@todo/container';

import {
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  SystemDictionaryService,
} from './api';

export const registerServerServices = () => {
  register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
  register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
};
