import type { IIndexedDBService } from './types';

import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

export class IndexedDBService implements IIndexedDBService {
  constructor(private db$: Observable<IDBDatabase | null>) {}

  query<T>(name: string, action: (store: IDBObjectStore) => Observable<T>): Observable<T>;
  query<T>(names: string[], action: (stores: IDBObjectStore[]) => Observable<T>): Observable<T>;

  query<T>(
    nameOrNames: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- adapt the interface difinition
    action: (storeOrStores: any) => Observable<T>,
  ): Observable<T> {
    return this.execCore<T>(nameOrNames, 'readonly', action);
  }

  exec<T>(name: string, action: (store: IDBObjectStore) => Observable<T>): Observable<T>;
  exec<T>(names: string[], action: (stores: IDBObjectStore[]) => Observable<T>): Observable<T>;

  exec<T>(
    nameOrNames: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- adapt the interface difinition
    action: (storeOrStores: any) => Observable<T>,
  ): Observable<T> {
    return this.execCore<T>(nameOrNames, 'readwrite', action);
  }

  execCore<T>(
    nameOrNames: string | string[],
    mode: IDBTransactionMode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- adapt the interface difinition
    action: (storeOrStores: any) => Observable<T>,
  ): Observable<T> {
    return this.db$.pipe(
      concatMap((db) => {
        if (!db) {
          throw new Error('db has been closed.');
        }

        const storeNames = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
        const transaction = db.transaction(storeNames, mode);
        const stores = storeNames.map((name) => transaction.objectStore(name));

        const isMultiple = Array.isArray(nameOrNames);
        return new Observable<T>((observer) => {
          const result = isMultiple ? action(stores) : action(stores[0]);

          const subscription = result.subscribe({
            error: (e) => observer.error(e),
            next: (v) => observer.next(v),
            complete: () => {
              subscription.unsubscribe();
              transaction.commit();
            },
          });

          transaction.onabort = (e) => observer.error(e);
          transaction.onerror = (e) => observer.error(e);
          transaction.oncomplete = () => observer.complete();
        });
      }),
    );
  }
}
