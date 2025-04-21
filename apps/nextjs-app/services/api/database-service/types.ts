import type { IDisposable } from '@todo/container';
import type { drizzle } from 'drizzle-orm/node-postgres';

import { createIdentifier } from '@todo/container';

export interface IPostgreSQLConnectionService extends IDisposable {
  instance: ReturnType<typeof drizzle>;
}
export const IPostgreSQLConnectionService = createIdentifier<IPostgreSQLConnectionService>(
  Symbol('IPostgreSQLConnectionService'),
);
