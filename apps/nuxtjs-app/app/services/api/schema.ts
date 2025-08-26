import { sql } from 'drizzle-orm';
import { bigint, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const systemDictionaryTable = pgTable('system-dictionary', {
  id: uuid().defaultRandom().primaryKey().unique(),
  key: varchar({ length: 255 }).notNull(),
  value: text().notNull(),
  userId: uuid().notNull(),
  createdBy: uuid().notNull(),
  createdAt: bigint({ mode: 'number' }).default(sql`EXTRACT(EPOCH FROM NOW()) * 1000`),
  updatedBy: uuid().notNull(),
  updatedAt: bigint({ mode: 'number' }).default(sql`EXTRACT(EPOCH FROM NOW()) * 1000`),
});
