import type { AdapterAccountType } from 'next-auth/adapters';

import { sql } from 'drizzle-orm';
import {
  bigint,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

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
    createdBy: uuid().notNull(),
    updatedBy: uuid().notNull(),
  },
  (table) => [index('createdAt_idx').on(table.createdAt), index('updatedAt_idx').on(table.updatedAt)],
);

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

export const usersTable = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
  },
  (table) => [index('email_idx').on(table.email)],
);

export const accountsTable = pgTable(
  'accounts',
  {
    id: serial().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 }).$type<AdapterAccountType>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: bigint('expires_at', { mode: 'number' }),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [index('provider_idx').on(table.provider, table.providerAccountId)],
);

export const sessionsTable = pgTable('sessions', {
  id: serial().primaryKey(),
  sessionToken: varchar('sessionToken', { length: 255 }),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokensTable = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    primaryKey({ name: 'verificationToken_pk', columns: [verificationToken.identifier, verificationToken.token] }),
  ],
);
