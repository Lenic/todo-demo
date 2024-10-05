import { Observable, of } from 'rxjs';
import { concatMap, filter, finalize, map, take, toArray } from 'rxjs/operators';
import { ETodoListType, ETodoStatus, IDataStorageService, ITodoItem, ITodoListQueryArgs } from './types';
import { nanoid } from 'nanoid';

import { injectableWith } from '@/lib/injector';
import { connect$, IIndexedDBService, fromDBRequest } from '@/lib/indexed-db';
import dayjs from 'dayjs';

const TABLE_NAME = 'todo-list';

@injectableWith(IDataStorageService)
export class IndexedDBDataStorageService implements IDataStorageService {
  private storage$: Observable<IIndexedDBService>;

  constructor() {
    const connection$ = connect$('todo', 1);

    connection$
      .pipe(
        filter((v) => v.type === 'upgrade-version'),
        take(1),
      )
      .subscribe(({ event }) => {
        if (!event.target) return;

        const db = (event.target as IDBOpenDBRequest).result;
        const store = db.createObjectStore(TABLE_NAME, { keyPath: 'id' });

        store.createIndex('id', 'id', { unique: true });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      });

    this.storage$ = connection$.pipe(
      filter((v) => v.type === 'open'),
      map((v) => v.service),
    );
  }

  query(args: ITodoListQueryArgs): Observable<ITodoItem[]> {
    return this.storage$.pipe(
      take(1),
      concatMap((service) =>
        service.query(TABLE_NAME, (store) => {
          const indexKey = args.type !== ETodoListType.ARCHIVE ? 'createdAt' : 'updatedAt';

          let isSkiped = false;
          const todayStartTimeValue = dayjs().startOf('day').valueOf();
          return fromDBRequest(store.index(indexKey).openCursor(null, 'prev'), false).pipe(
            concatMap(({ value: cursor, complete }) => {
              if (cursor === null) {
                return of().pipe(finalize(complete));
              }

              if (!isSkiped && args.offset > 0) {
                isSkiped = true;
                cursor.advance(args.offset);
                return of();
              } else {
                cursor.continue();
                return of(cursor.value as ITodoItem);
              }
            }),
            filter((v) => {
              if (args.type === ETodoListType.PENDING) {
                return (
                  v.status === ETodoStatus.PENDING &&
                  (!v.overdueAt || (!!v.overdueAt && v.overdueAt >= todayStartTimeValue))
                );
              } else if (args.type === ETodoListType.OVERDUE) {
                return v.status === ETodoStatus.PENDING && !!v.overdueAt && v.overdueAt < todayStartTimeValue;
              } else {
                return v.status === ETodoStatus.DONE;
              }
            }),
            take(args.limit),
            toArray(),
          );
        }),
      ),
    );
  }

  add(item: Omit<ITodoItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<ITodoItem> {
    return this.storage$.pipe(
      concatMap((service) =>
        service.exec(TABLE_NAME, (store) => {
          const id$ = new Observable<string>((observer) => {
            const generate = () => {
              const id = nanoid();
              fromDBRequest(store.getKey(id)).subscribe((key) => {
                if (key) {
                  generate();
                } else {
                  observer.next(id);
                }
              });
            };
            generate();
          });

          return id$.pipe(
            take(1),
            concatMap((id) => {
              const now = Date.now();
              const convertedItem = { ...item, id, createdAt: now, updatedAt: now } as ITodoItem;

              return fromDBRequest(store.add(convertedItem)).pipe(map(() => convertedItem));
            }),
          );
        }),
      ),
      take(1),
    );
  }
  update(item: ITodoItem): Observable<ITodoItem> {
    return this.storage$.pipe(
      concatMap((service) =>
        service.exec(TABLE_NAME, (store) => {
          const convertedItem = { ...item, updatedAt: Date.now() } as ITodoItem;
          return fromDBRequest(store.put(convertedItem)).pipe(map(() => convertedItem));
        }),
      ),
      take(1),
    );
  }
  delete(id: string): Observable<void> {
    return this.storage$.pipe(
      concatMap((service) => service.exec(TABLE_NAME, (store) => fromDBRequest(store.delete(id)))),
      take(1),
    );
  }
}
