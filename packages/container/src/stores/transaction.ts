import type { IDisposable, IInstanceContext, IInstanceStore } from '../types';
import type { ComposePlugin } from '@lenic/compose';

const TransactionStoreKey = Symbol('TransactionStoreKey');

export class TransactionStore implements IInstanceStore {
  plugin: ComposePlugin<unknown, IInstanceContext>;

  constructor() {
    this.plugin = {
      order: 0,
      desc: 'TransactionStore',
      executor: (next, args) => {
        let store = args.context[TransactionStoreKey] as Map<string | symbol, unknown> | undefined;
        if (!store) {
          store = new Map<string | symbol, unknown>();

          const result = next({ ...args, context: { ...args.context, [TransactionStoreKey]: store } });

          Array.from(store.values()).forEach((item) => (item as IDisposable | null)?.dispose());
          store.clear();

          return result;
        } else {
          const key = args.identifier.getIdentifier();

          let result = store.get(key);
          if (result) return result;

          result = next();
          store.set(key, result);

          return result;
        }
      },
    };
  }
}
