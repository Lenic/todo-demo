import type { IPostgreSQLConnectionService } from './types';

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

class PostgreSQLConnectionService implements IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;

  constructor() {
    const runtimeConfig = useRuntimeConfig();
    const pool = new Pool({
      connectionString: runtimeConfig.databaseUrl,
    });
    this.instance = drizzle({ client: pool });
  }
}

export { PostgreSQLConnectionService };
