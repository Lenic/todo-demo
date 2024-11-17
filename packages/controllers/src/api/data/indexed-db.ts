import type { IIndexedDBService } from '@todo/indexed-db';
import type { ICreatedTodoItem, ITodoItem, ITodoListQueryArgs } from './types';

import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { Observable, of } from 'rxjs';
import { concatMap, delay, filter, finalize, map, skip, take, toArray } from 'rxjs/operators';

import { injectableWith } from '@todo/container';
import { connect$, fromDBRequest } from '@todo/indexed-db';

import { ETodoListType, ETodoStatus, IDataStorageService } from './types';

const TABLE_NAME = 'todo-list';

@injectableWith(IDataStorageService)
class IndexedDBDataStorageService implements IDataStorageService {
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

          const todayStartTimeValue = dayjs().startOf('day').valueOf();
          return fromDBRequest(store.index(indexKey).openCursor(null, 'prev'), false).pipe(
            concatMap((res) => {
              const { value: cursor } = res;

              if (cursor === null) {
                return of().pipe(
                  finalize(() => {
                    res.complete();
                  }),
                );
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
            skip(args.offset),
            take(args.limit),
            toArray(),
          );
        }),
      ),
      delay(Math.floor(Math.random() * (2000 - 30 + 1)) + 30),
    );
  }

  add(item: ICreatedTodoItem): Observable<ITodoItem> {
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
              const convertedItem = {
                ...item,
                id,
                createdAt: now,
                updatedAt: now,
                status: ETodoStatus.PENDING,
              } as ITodoItem;

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

export { IndexedDBDataStorageService };
