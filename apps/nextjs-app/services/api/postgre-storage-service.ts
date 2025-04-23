import type { ICreatedTodoItem, IDataStorageService, ITodoItem, ITodoListQueryArgs } from '@todo/interface';
import type { SQL } from 'drizzle-orm';
import type { Observable } from 'rxjs';

import { Disposable, injectableWith, injectWith } from '@todo/container';
import { ETodoListType, ETodoStatus } from '@todo/interface';
import dayjs from 'dayjs';
import { and, desc, eq, gte, isNotNull, isNull, lt, or } from 'drizzle-orm';
import { concatMap, from, map, toArray } from 'rxjs';

import { IPostgreSQLConnectionService } from './database-service';
import { todoTable } from './schema';

@injectableWith()
class PostgreSQLDataStorageService extends Disposable implements IDataStorageService {
  constructor(@injectWith(IPostgreSQLConnectionService) private db: IPostgreSQLConnectionService) {
    super();
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

    const res = this.db.instance
      .select()
      .from(todoTable)
      .where(operator)
      .offset(args.offset)
      .limit(args.limit)
      .orderBy(desc(args.type !== ETodoListType.ARCHIVE ? todoTable.updatedAt : todoTable.createdAt));

    return this.convertToDomain(res);
  }

  add(item: ICreatedTodoItem): Observable<ITodoItem> {
    const res = this.db.instance
      .insert(todoTable)
      .values({
        title: item.title,
        overdueAt: item.overdueAt ?? null,
      })
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  update(item: ITodoItem): Observable<ITodoItem> {
    const res = this.db.instance.update(todoTable).set(item).where(eq(todoTable.id, item.id)).returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  delete(id: string): Observable<void> {
    const res = this.db.instance.delete(todoTable).where(eq(todoTable.id, id));

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
