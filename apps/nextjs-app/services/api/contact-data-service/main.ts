import type { IPostgreSQLConnectionService } from '../database-service';
import type { IContactDataService, IContactItem, IContactListQueryArgs, ICreatedContactItem } from './types';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { from, map } from 'rxjs';

import { contactTable } from '../schema';

export class ContactDataService extends Disposable implements IContactDataService {
  constructor(private db: IPostgreSQLConnectionService) {
    super();
  }

  query(args: IContactListQueryArgs): Observable<IContactItem[]> {
    const res = this.db.instance
      .select()
      .from(contactTable)
      .where(eq(contactTable.userId, args.userId))
      .offset(args.offset)
      .limit(args.limit)
      .orderBy(contactTable.alias, contactTable.name, contactTable.email);

    return this.convertToDomain(res);
  }

  add(item: ICreatedContactItem): Observable<IContactItem> {
    const res = this.db.instance.insert(contactTable).values(item).returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  update(item: IContactItem): Observable<IContactItem> {
    const { createdAt: _at, createdBy: _by, ...rest } = item;

    const res = this.db.instance
      .update(contactTable)
      .set({ ...rest, updatedAt: sql`EXTRACT(EPOCH FROM NOW()) * 1000` })
      .where(eq(contactTable.id, item.id))
      .returning();

    return this.convertToDomain(res).pipe(map((list) => list[0]));
  }

  delete(id: string): Observable<void> {
    const res = this.db.instance.delete(contactTable).where(eq(contactTable.id, id));

    return from(res).pipe(map(() => void 0));
  }

  private convertToDomain(waitList: Promise<(typeof contactTable.$inferSelect)[]>): Observable<IContactItem[]> {
    return from(waitList).pipe(map((list) => list as IContactItem[]));
  }
}
