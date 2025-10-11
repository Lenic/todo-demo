import type { IContainerStore } from '../types';

import { ContainerLifetimeTypes } from '../constants';

const TransactionStoreKey = Symbol('TransactionStoreKey');

export const transactionStore: IContainerStore = {
  order: 0,
  desc: 'TransactionStore',
  executor: (next, args) => {
    if (args.lifetimeType !== ContainerLifetimeTypes.Transaction) return next();

    let store = args[TransactionStoreKey] as Map<string | symbol, unknown> | undefined;
    if (!store) {
      store = new Map<string | symbol, unknown>();
      return next({ ...args, [TransactionStoreKey]: store });
    } else {
      const key = args.identifier.getIdentifier();

      let result = store.get(key);
      if (result) return result;

      result = next();
      store.set(key, result);

      return result;
    }
  },
  delete() {
    // nothing to do
  },
};
