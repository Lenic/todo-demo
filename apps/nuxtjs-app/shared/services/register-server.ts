import { register } from '@todo/container';

import {
  IPostgreSQLConnectionService,
  ISystemDictionaryService,
  PostgreSQLConnectionService,
  SystemDictionaryService,
} from './api';

export const registerService = () => {
  register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
  register(ISystemDictionaryService, SystemDictionaryService, [IPostgreSQLConnectionService]);
};
