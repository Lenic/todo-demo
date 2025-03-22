import { sql } from 'drizzle-orm';
import { bigint, index, pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const todoStatusEnum = pgEnum('TodoStatus', ['PENDING', 'DONE']);

export const todoTable = pgTable(
  'todo-list',
  {
    title: varchar({ length: 255 }).notNull(),
    overdueAt: bigint({ mode: 'number' }),
    id: uuid().defaultRandom().primaryKey().unique(),
    description: text(),
    createdAt: bigint({ mode: 'number' }).default(sql`EXTRACT(EPOCH FROM NOW()) * 1000`),
    status: todoStatusEnum().default('PENDING'),
    updatedAt: bigint({ mode: 'number' }).default(sql`EXTRACT(EPOCH FROM NOW()) * 1000`),
  },
  (table) => [index('overdueAt_idx').on(table.overdueAt), index('updatedAt_idx').on(table.updatedAt)],
);
