import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './services/api/data/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is only a config
    url: process.env.DATABASE_URL!,
  },
});
