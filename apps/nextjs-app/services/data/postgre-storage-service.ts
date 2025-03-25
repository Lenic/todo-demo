import type { ICreatedTodoItem, ITodoItem, ITodoListQueryArgs } from '@todo/controllers';
import type { SQL } from 'drizzle-orm';
import type { Pool } from 'pg';
import type { Observable } from 'rxjs';

import { Disposable, injectableWith } from '@todo/container';
import { ETodoListType, ETodoStatus, IDataStorageService } from '@todo/controllers';
import dayjs from 'dayjs';
import { and, desc, eq, gte, isNotNull, isNull, lt, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { concatMap, from, map, toArray } from 'rxjs';

import { connectString } from './constants';
import { todoTable } from './schema';

@injectableWith(IDataStorageService, false)
class PostgreSQLDataStorageService extends Disposable implements IDataStorageService {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    super();

    this.db = drizzle(connectString);
    this.disposeWithMe(() => {
      (this.db.$client as Pool).end().catch((e: unknown) => {
        console.error('close database error', e);
      });
    });
  }

  query(args: ITodoListQueryArgs): Observable<ITodoItem[]> {
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

    const res = this.db
      .select()
      .from(todoTable)
      .where(operator)
      .offset(args.offset)
      .limit(args.limit)
      .orderBy(desc(args.type !== ETodoListType.ARCHIVE ? todoTable.updatedAt : todoTable.createdAt));

    return from(res).pipe(
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
              }) as ITodoItem,
          ),
          toArray(),
        ),
      ),
    );
  }

  add(item: ICreatedTodoItem): Observable<ITodoItem> {
    const res = this.db
      .insert(todoTable)
      .values({
        title: item.title,
        overdueAt: item.overdueAt ?? null,
      })
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  update(item: ITodoItem): Observable<ITodoItem> {
    const res = this.db.update(todoTable).set(item).where(eq(todoTable.id, item.id)).returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  delete(id: string): Observable<void> {
    const res = this.db.delete(todoTable).where(eq(todoTable.id, id));

    return from(res).pipe(map(() => void 0));
  }

  private convertToDomain(waitList: Promise<(typeof todoTable.$inferSelect)[]>): Observable<ITodoItem[]> {
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
              }) as ITodoItem,
          ),
          toArray(),
        ),
      ),
    );
  }
}

export { PostgreSQLDataStorageService };
