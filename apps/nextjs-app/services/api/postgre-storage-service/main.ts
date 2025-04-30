import type { IPostgreSQLConnectionService } from '../database-service';
import type { IDBCreatedTodoItem, IDBTodoItem } from './types';
import type { IDataStorageService, ITodoListQueryArgs } from '@todo/interface';
import type { SQL } from 'drizzle-orm';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import { ETodoListType, ETodoStatus } from '@todo/interface';
import dayjs from 'dayjs';
import { sql } from 'drizzle-orm';
import { and, desc, eq, gte, isNotNull, isNull, lt, or } from 'drizzle-orm';
import { concatMap, filter, from, map, toArray } from 'rxjs';

import { auth } from '@/auth';

import { todoTable } from '../schema';

class PostgreSQLDataStorageService extends Disposable implements IDataStorageService<IDBCreatedTodoItem, IDBTodoItem> {
  constructor(private db: IPostgreSQLConnectionService) {
    super();
  }

  query(args: ITodoListQueryArgs): Observable<IDBTodoItem[]> {
    const todayStartTimeValue = dayjs().startOf('day').valueOf();

    let operator: SQL | undefined = undefined;
    if (args.type === ETodoListType.PENDING) {
      operator = and(
        eq(todoTable.status, ETodoStatus.PENDING),
        or(
          isNull(todoTable.overdueAt),
          and(isNotNull(todoTable.overdueAt), gte(todoTable.overdueAt, todayStartTimeValue)),
        ),
      );
    } else if (args.type === ETodoListType.OVERDUE) {
      operator = and(
        eq(todoTable.status, ETodoStatus.PENDING),
        and(isNotNull(todoTable.overdueAt), lt(todoTable.overdueAt, todayStartTimeValue)),
      );
    } else {
      operator = eq(todoTable.status, ETodoStatus.DONE);
    }

    return from(auth()).pipe(
      map((v) => v?.user?.id ?? ''),
      filter((v) => !!v),
      concatMap((userId) => {
        const res = this.db.instance
          .select()
          .from(todoTable)
          .where(and(operator, eq(todoTable.createdBy, userId)))
          .offset(args.offset)
          .limit(args.limit)
          .orderBy(desc(args.type !== ETodoListType.ARCHIVE ? todoTable.updatedAt : todoTable.createdAt));

        return this.convertToDomain(res);
      }),
    );
  }

  add(item: IDBCreatedTodoItem): Observable<IDBTodoItem> {
    const res = this.db.instance
      .insert(todoTable)
      .values({
        title: item.title,
        overdueAt: item.overdueAt ?? null,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
      })
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  update(item: IDBTodoItem): Observable<IDBTodoItem> {
    const res = this.db.instance
      .update(todoTable)
      .set({
        ...item,
        description: item.description ?? null,
        overdueAt: item.overdueAt ?? null,
        updatedAt: sql`EXTRACT(EPOCH FROM NOW()) * 1000`,
      })
      .where(eq(todoTable.id, item.id))
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  delete(id: string): Observable<void> {
    const res = this.db.instance.delete(todoTable).where(eq(todoTable.id, id));

    return from(res).pipe(map(() => void 0));
  }

  private convertToDomain(waitList: Promise<(typeof todoTable.$inferSelect)[]>): Observable<IDBTodoItem[]> {
    return from(waitList).pipe(
      concatMap((list) =>
        from(list).pipe(
          map(
            (item) =>
              ({
                createdAt: item.createdAt ?? undefined,
                id: item.id,
                status: item.status ?? undefined,
                title: item.title,
                updatedAt: item.updatedAt ?? undefined,
                description: item.description ?? undefined,
                overdueAt: item.overdueAt ?? undefined,
              }) as IDBTodoItem,
          ),
          toArray(),
        ),
      ),
    );
  }
}

export { PostgreSQLDataStorageService };
