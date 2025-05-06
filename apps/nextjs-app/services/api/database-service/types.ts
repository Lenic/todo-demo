import type { drizzle } from 'drizzle-orm/neon-serverless';

import { createIdentifier } from '@todo/container';

export interface IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;
}
export const IPostgreSQLConnectionService = createIdentifier<IPostgreSQLConnectionService>(
  Symbol('IPostgreSQLConnectionService'),
);
