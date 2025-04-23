import type { IPostgreSQLConnectionService } from './types';
import type { Pool } from 'pg';

import { Disposable, injectableWith } from '@todo/container';
import { drizzle } from 'drizzle-orm/node-postgres';

import { connectString } from './constants';

@injectableWith()
class PostgreSQLConnectionService extends Disposable implements IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;

  constructor() {
    super();

    this.instance = drizzle(connectString);
    this.disposeWithMe(() => {
      (this.instance.$client as Pool).end().catch((e: unknown) => {
        console.error('close database error', e);
      });
    });
  }
}

export { PostgreSQLConnectionService };
