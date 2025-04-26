import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// read target env file.
const env = process.env.NODE_ENV;
const path = `.env${env ? `.${env}` : ''}.local`;
config({ override: true, path });
console.log('\x1b[32mRead Environment File: %s\x1b[0m', path);

export default defineConfig({
  out: './drizzle',
  schema: './services/api/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
