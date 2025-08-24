import type { IPostgreSQLConnectionService } from './types';

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { useRuntimeConfig } from 'nuxt/app';

class PostgreSQLConnectionService implements IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;

  constructor() {
    const config = useRuntimeConfig();
    const pool = new Pool({ connectionString: config.databaseUrl });
    this.instance = drizzle({ client: pool });
  }
}

export { PostgreSQLConnectionService };
