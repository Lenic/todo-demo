import type { IContainerIdentifier, ILifetime } from '../types';

import { ContainerLifetimeTypes } from '../constants';

const TransactionStoreKey = Symbol('TransactionStoreKey');

export const transactionLifetime: ILifetime = {
  order: 0,
  name: ContainerLifetimeTypes.Transaction,
  executor: (next, args) => {
    if (args.lifetimeName !== ContainerLifetimeTypes.Transaction) return next();

    let store = args[TransactionStoreKey] as Map<IContainerIdentifier, unknown> | undefined;
    if (!store) {
      store = new Map<IContainerIdentifier, unknown>();
      return next({ ...args, [TransactionStoreKey]: store });
    } else {
      let result = store.get(args.identifier);
      if (result) return result;

      result = next();
      store.set(args.identifier, result);

      return result;
    }
  },
  delete() {
    // nothing to do
  },
};
