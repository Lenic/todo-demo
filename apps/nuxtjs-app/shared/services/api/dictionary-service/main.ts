import type { IPostgreSQLConnectionService } from '../database-service';
import type { ICreatedSystemDictionaryItem, ISystemDictionaryItem, ISystemDictionaryService } from './types';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import { sql } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import { from, map } from 'rxjs';

import { systemDictionaryTable } from '../schema';

export class SystemDictionaryService extends Disposable implements ISystemDictionaryService {
  constructor(private db: IPostgreSQLConnectionService) {
    super();
  }

  get(key: string, userId: string): Observable<ISystemDictionaryItem | undefined> {
    const res = this.db.instance
      .select()
      .from(systemDictionaryTable)
      .where(and(eq(systemDictionaryTable.key, key), eq(systemDictionaryTable.userId, userId)));

    return this.convertToDomain(res).pipe(map((list) => list[0]));
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
    const { createdAt: _at, createdBy: _by, ...rest } = item;

    const res = this.db.instance
      .update(systemDictionaryTable)
      .set({ ...rest, updatedAt: sql`EXTRACT(EPOCH FROM NOW()) * 1000` })
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
    return from(waitList).pipe(map((list) => list as ISystemDictionaryItem[]));
  }
}
// export { SystemDictionaryService };
