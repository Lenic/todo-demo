import type { IDBRequestResult } from './types';

import { Observable } from 'rxjs';

export function fromDBRequest<T>(dbRequest: IDBRequest<T>): Observable<T>;
export function fromDBRequest<T>(dbRequest: IDBRequest<T>, autoComplete: false): Observable<IDBRequestResult<T>>;

export function fromDBRequest<T>(dbRequest: IDBRequest<T>, autoComplete = true) {
  return new Observable<IDBRequestResult<T> | T>((observer) => {
    const errorAction = (error: Event) => {
      observer.error(error);
      observer.complete();
    };
    const successAction = () => {
      if (autoComplete) {
        observer.next(dbRequest.result);
        observer.complete();
      } else {
        observer.next({
          value: dbRequest.result,
          complete: () =>
            void Promise.resolve().then(() => {
              observer.complete();
            }),
        } as IDBRequestResult<T>);
      }
    };

    dbRequest.addEventListener('error', errorAction);
    dbRequest.addEventListener('success', successAction);

    return () => {
      dbRequest.removeEventListener('error', errorAction);
      dbRequest.removeEventListener('success', successAction);
    };
  });
}
