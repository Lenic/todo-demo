import { Observable } from 'rxjs';

export interface IIndexedDBService {
  query<T>(name: string, action: (store: IDBObjectStore) => Observable<T>): Observable<T>;
  query<T>(names: string[], action: (stores: IDBObjectStore[]) => Observable<T>): Observable<T>;

  exec<T>(name: string, action: (store: IDBObjectStore) => Observable<T>): Observable<T>;
  exec<T>(names: string[], action: (stores: IDBObjectStore[]) => Observable<T>): Observable<T>;
}

export interface IIndexedDBOpenEvent {
  type: 'open';
  service: IIndexedDBService;
}

export interface IIndexedDBUpgradeEvent {
  type: 'upgrade-version';
  event: IDBVersionChangeEvent;
}

export interface IIndexedDBVersionChangeEvent {
  type: 'version-change';
  event: IDBVersionChangeEvent;
}

export type TIndexedDBConnectEvent = IIndexedDBOpenEvent | IIndexedDBUpgradeEvent | IIndexedDBVersionChangeEvent;

export interface IDBRequestResult<T> {
  value: T;
  complete(): void;
}
