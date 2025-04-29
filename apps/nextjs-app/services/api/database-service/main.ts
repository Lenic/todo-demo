import type { IPostgreSQLConnectionService } from './types';

import { Disposable } from '@todo/container';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

class PostgreSQLConnectionService extends Disposable implements IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;

  constructor() {
    super();

    // Disable prefetch as it is not supported for "Transaction" pool mode
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    this.instance = drizzle(client);
    this.disposeWithMe(() => {
      this.instance.$client.end().catch((e: unknown) => {
        console.error('close database error', e);
      });
    });
  }
}

export { PostgreSQLConnectionService };
