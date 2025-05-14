import type { ICreatedItem, IItem } from '../types';
import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export interface ICreatedContactItem extends ICreatedItem {
  id: string;
  alias?: string;
  name: string;
  email: string;
  userId: string;
}

export interface IContactItem extends ICreatedContactItem, IItem {}

export interface IContactListQueryArgs {
  offset: number;
  limit: number;
  userId: string;
}

export interface IContactDataService {
  query(args: IContactListQueryArgs): Observable<IContactItem[]>;

  add(item: ICreatedContactItem): Observable<IContactItem>;
  update(item: IContactItem): Observable<IContactItem>;
  delete(id: string): Observable<void>;
}
export const IContactDataService = createIdentifier<IContactDataService>(Symbol('IContactDataService'));
