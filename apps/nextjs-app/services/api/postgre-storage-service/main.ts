import type { IPostgreSQLConnectionService } from '../database-service';
import type { IDBCreatedTodoItem, IDBTodoItem, IDBTodoListQueryArgs } from './types';
import type { IDataStorageService } from '@todo/interface';
import type { SQL } from 'drizzle-orm';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import { ETodoListType, ETodoStatus } from '@todo/interface';
import { and, desc, eq, gte, isNotNull, isNull, lt, or, sql } from 'drizzle-orm';
import { from, map } from 'rxjs';

import { todoTable } from '../schema';

class PostgreSQLDataStorageService
  extends Disposable
  implements IDataStorageService<IDBCreatedTodoItem, IDBTodoItem, IDBTodoListQueryArgs>
{
  constructor(private db: IPostgreSQLConnectionService) {
    super();
  }

  query(args: IDBTodoListQueryArgs): Observable<IDBTodoItem[]> {
    let operator: SQL | undefined = undefined;
    if (args.type === ETodoListType.PENDING) {
      operator = and(
        eq(todoTable.status, ETodoStatus.PENDING),
        or(isNull(todoTable.overdueAt), and(isNotNull(todoTable.overdueAt), gte(todoTable.overdueAt, args.todyZero))),
      );
    } else if (args.type === ETodoListType.OVERDUE) {
      operator = and(
        eq(todoTable.status, ETodoStatus.PENDING),
        and(isNotNull(todoTable.overdueAt), lt(todoTable.overdueAt, args.todyZero)),
      );
    } else {
      operator = eq(todoTable.status, ETodoStatus.DONE);
    }

    const res = this.db.instance
      .select()
      .from(todoTable)
      .where(and(operator, eq(todoTable.createdBy, args.userId)))
      .offset(args.offset)
      .limit(args.limit)
      .orderBy(desc(args.type !== ETodoListType.ARCHIVE ? todoTable.updatedAt : todoTable.createdAt));

    return this.convertToDomain(res);
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
    const { createdAt: _at, createdBy: _by, ...rest } = item;

    const res = this.db.instance
      .update(todoTable)
      .set({
        ...rest,
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
    return from(waitList).pipe(map((list) => list as IDBTodoItem[]));
  }
}

export { PostgreSQLDataStorageService };
