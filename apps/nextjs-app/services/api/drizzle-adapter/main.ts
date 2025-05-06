import type { IPostgreSQLConnectionService } from '../database-service';
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from '@auth/core/adapters';

import { and, eq } from 'drizzle-orm';

import { accountsTable, sessionsTable, usersTable, verificationTokensTable } from '../schema';

export class DrizzleAdapter implements Adapter {
  constructor(private service: IPostgreSQLConnectionService) {}

  createUser = async (user: AdapterUser): Promise<AdapterUser> => {
    const data = await this.service.instance.insert(usersTable).values(user).returning();
    return data[0] as AdapterUser;
  };

  getUser = async (id: string): Promise<AdapterUser | null> => {
    const data = await this.service.instance.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return data.length ? (data[0] as AdapterUser) : null;
  };

  getUserByEmail = async (email: string): Promise<AdapterUser | null> => {
    const data = await this.service.instance.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return data.length ? (data[0] as AdapterUser) : null;
  };

  getUserByAccount = async (
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ): Promise<AdapterUser | null> => {
    const data = await this.service.instance
      .select({
        account: accountsTable,
        user: usersTable,
      })
      .from(accountsTable)
      .innerJoin(usersTable, eq(usersTable.id, accountsTable.userId))
      .where(
        and(
          eq(accountsTable.provider, providerAccountId.provider),
          eq(accountsTable.providerAccountId, providerAccountId.providerAccountId),
        ),
      )
      .limit(1);
    return data.length ? (data[0].user as AdapterUser) : null;
  };

  updateUser = async (user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> => {
    if (!user.id) {
      throw new Error('No user id.');
    }

    const data = await this.service.instance.update(usersTable).set(user).where(eq(usersTable.id, user.id)).returning();

    if (!data.length) {
      throw new Error('No user found.');
    }

    return data[0] as AdapterUser;
  };

  deleteUser = async (userId: string): Promise<AdapterUser | null | undefined> => {
    const data = await this.service.instance.delete(usersTable).where(eq(usersTable.id, userId)).returning();

    await this.service.instance.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
    await this.service.instance.delete(accountsTable).where(eq(accountsTable.userId, userId));

    return data.length ? (data[0] as AdapterUser | null | undefined) : null;
  };

  linkAccount = async (account: AdapterAccount): Promise<AdapterAccount | null | undefined> => {
    const data = await this.service.instance.insert(accountsTable).values(account).returning();
    return data[0] as AdapterAccount | null | undefined;
  };

  unlinkAccount = async (
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ): Promise<AdapterAccount | undefined> => {
    const data = await this.service.instance
      .delete(accountsTable)
      .where(
        and(
          eq(accountsTable.provider, providerAccountId.provider),
          eq(accountsTable.providerAccountId, providerAccountId.providerAccountId),
        ),
      )
      .returning();
    return data[0] as AdapterAccount | undefined;
  };

  createSession = async (session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> => {
    if (!session.userId) {
      throw Error(`userId is undef in createSession`);
    }

    const data = await this.service.instance.insert(sessionsTable).values(session).returning();
    return data[0] as AdapterSession;
  };

  getSessionAndUser = async (sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> => {
    if (!sessionToken) return null;

    const data = await this.service.instance
      .select({
        session: sessionsTable,
        user: usersTable,
      })
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .limit(1);

    return !data.length
      ? null
      : {
          session: data[0].session as AdapterSession,
          user: data[0].user as AdapterUser,
        };
  };

  updateSession = async (
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ): Promise<AdapterSession | null | undefined> => {
    const data = await this.service.instance
      .update(sessionsTable)
      .set(session)
      .where(eq(sessionsTable.sessionToken, session.sessionToken))
      .returning();
    return data[0] as AdapterSession | null | undefined;
  };

  deleteSession = async (sessionToken: string): Promise<AdapterSession | null | undefined> => {
    const data = await this.service.instance
      .delete(sessionsTable)
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .returning();
    return data[0] as AdapterSession | null | undefined;
  };

  createVerificationToken = async (
    verificationToken: VerificationToken,
  ): Promise<VerificationToken | null | undefined> => {
    const data = await this.service.instance.insert(verificationTokensTable).values(verificationToken).returning();
    return data[0] as VerificationToken | null | undefined;
  };

  useVerificationToken = async (params: { identifier: string; token: string }): Promise<VerificationToken | null> => {
    const data = await this.service.instance
      .delete(verificationTokensTable)
      .where(
        and(eq(verificationTokensTable.identifier, params.identifier), eq(verificationTokensTable.token, params.token)),
      )
      .returning();
    return data.length ? (data[0] as VerificationToken) : null;
  };
}
