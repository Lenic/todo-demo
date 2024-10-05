import type { TIndexedDBConnectEvent } from './types';

import { BehaviorSubject, Observable } from 'rxjs';

import { IndexedDBService } from './service';

export function connect$(name: string, version: number) {
  return new Observable<TIndexedDBConnectEvent>((observer) => {
    const request = indexedDB.open(name, version);

    request.onerror = () => observer.error('Failed to open database');
    request.onupgradeneeded = (event) => observer.next({ type: 'upgrade-version', event });

    const subject = new BehaviorSubject<IDBDatabase | null>(null);
    request.onsuccess = () => {
      subject.next(request.result);

      request.result.onversionchange = (event) => {
        request.result.close();
        subject.next(null);

        observer.next({ type: 'version-change', event });
      };

      observer.next({ type: 'open', service: new IndexedDBService(subject.asObservable()) });
    };

    return () => {
      subject.getValue()?.close();
      subject.complete();
    };
  });
}
