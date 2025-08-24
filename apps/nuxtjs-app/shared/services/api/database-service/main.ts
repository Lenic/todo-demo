import type { IPostgreSQLConnectionService } from './types';

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

class PostgreSQLConnectionService implements IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new Pool({
      connectionString: '',
    });
    this.instance = drizzle({ client: pool });
  }
}

export { PostgreSQLConnectionService };
