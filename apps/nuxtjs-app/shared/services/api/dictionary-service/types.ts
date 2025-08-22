import type { ICreatedItem, IItem } from '../types';
import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export interface ICreatedSystemDictionaryItem extends ICreatedItem {
  key: string;
  value: string;
  userId: string;
}

export interface ISystemDictionaryItem extends ICreatedSystemDictionaryItem, IItem {
  id: string;
}

export interface ISystemDictionaryService {
  get(key: string, userId: string): Observable<ISystemDictionaryItem | undefined>;

  add(item: ICreatedSystemDictionaryItem): Observable<ISystemDictionaryItem>;
  update(item: ISystemDictionaryItem): Observable<ISystemDictionaryItem>;
  delete(id: string): Observable<void>;
}
export const ISystemDictionaryService = createIdentifier<ISystemDictionaryService>(Symbol('ISystemDictionaryService'));
