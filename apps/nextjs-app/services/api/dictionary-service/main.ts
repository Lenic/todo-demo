import type { IPostgreSQLConnectionService } from '../database-service';
import type { ICreatedSystemDictionaryItem, ISystemDictionaryItem, ISystemDictionaryService } from './types';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import { sql } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import { concatMap, filter, from, map, toArray } from 'rxjs';

import { auth } from '@/auth';

import { systemDictionaryTable } from '../schema';

class SystemDictionaryService extends Disposable implements ISystemDictionaryService {
  constructor(private db: IPostgreSQLConnectionService) {
    super();
  }

  get(key: string): Observable<ISystemDictionaryItem | undefined> {
    return from(auth()).pipe(
      map((v) => v?.user?.id ?? ''),
      filter((v) => !!v),
      concatMap((userId) => {
        const res = this.db.instance
          .select()
          .from(systemDictionaryTable)
          .where(and(eq(systemDictionaryTable.key, key), eq(systemDictionaryTable.userId, userId)));

        return this.convertToDomain(res).pipe(map((list) => list[0]));
      }),
    );
  }

  add(item: ICreatedSystemDictionaryItem): Observable<ISystemDictionaryItem> {
    const res = this.db.instance
      .insert(systemDictionaryTable)
      .values({
        key: item.key,
        value: item.value,
        userId: item.userId,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
      })
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  update(item: ISystemDictionaryItem): Observable<ISystemDictionaryItem> {
    const res = this.db.instance
      .update(systemDictionaryTable)
      .set({ ...item, updatedAt: sql`EXTRACT(EPOCH FROM NOW()) * 1000` })
      .where(eq(systemDictionaryTable.id, item.id))
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  delete(id: string): Observable<void> {
    const res = this.db.instance.delete(systemDictionaryTable).where(eq(systemDictionaryTable.id, id));

    return from(res).pipe(map(() => void 0));
  }

  private convertToDomain(
    waitList: Promise<(typeof systemDictionaryTable.$inferSelect)[]>,
  ): Observable<ISystemDictionaryItem[]> {
    return from(waitList).pipe(
      concatMap((list) =>
        from(list).pipe(
          map(
            (v) =>
              ({
                id: v.id,
                key: v.key,
                value: v.value,
              }) as ISystemDictionaryItem,
          ),
          toArray(),
        ),
      ),
    );
  }
}
export { SystemDictionaryService };
