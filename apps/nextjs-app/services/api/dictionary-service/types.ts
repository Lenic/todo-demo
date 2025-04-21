import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export interface ICreatedSystemDictionaryItem {
  key: string;
  value: string;
}

export interface ISystemDictionaryItem extends ICreatedSystemDictionaryItem {
  id: string;
}

export interface ISystemDictionaryService {
  query(ids: string[]): Observable<ISystemDictionaryItem[]>;
  get(key: string): Observable<ISystemDictionaryItem | undefined>;

  add(item: ICreatedSystemDictionaryItem): Observable<ISystemDictionaryItem>;
  update(item: ISystemDictionaryItem): Observable<ISystemDictionaryItem>;
  delete(id: string): Observable<void>;
}
export const ISystemDictionaryService = createIdentifier<ISystemDictionaryService>(Symbol('ISystemDictionaryService'));
