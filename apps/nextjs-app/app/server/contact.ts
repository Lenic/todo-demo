'use server';

import type { IContactItem, IContactListQueryArgs, ICreatedContactItem } from '@/services/api';

import { ServiceLocator } from '@todo/container';
import { concatMap, firstValueFrom } from 'rxjs';

import { IContactDataService } from '@/services/api';

import { publish } from './notifications';

const getService = () => ServiceLocator.default.get(IContactDataService);

export async function queryContactList(args: Omit<IContactListQueryArgs, 'userId'>) {
  const list$ = publish().pipe(concatMap(({ userId }) => getService().query({ ...args, userId })));

  return firstValueFrom(list$);
}

export async function addContactItem(partialItem: Omit<ICreatedContactItem, 'userId'>) {
  const item$ = publish().pipe(
    concatMap(({ userId, sync }) =>
      getService()
        .add({ ...partialItem, createdBy: userId, updatedBy: userId, userId })
        .pipe(concatMap((item) => sync({ type: 'add-contact', item }, item))),
    ),
  );

  return firstValueFrom(item$);
}

export async function updateContactItem(wholeItem: IContactItem) {
  const item$ = publish().pipe(
    concatMap(({ userId, sync }) =>
      getService()
        .update({ ...wholeItem, updatedBy: userId })
        .pipe(concatMap((item) => sync({ type: 'update-contact', item }, item))),
    ),
  );

  return firstValueFrom(item$);
}

export async function deleteContactItem(id: string) {
  const res$ = publish().pipe(
    concatMap(({ sync }) =>
      getService()
        .delete(id)
        .pipe(concatMap(() => sync({ type: 'delete-contact', id }, void 0))),
    ),
  );

  return firstValueFrom(res$);
}
