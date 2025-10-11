import type { IContainerStore } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = new Map<string | symbol, any>();

export const singleStore: IContainerStore = {
  order: 0,
  desc: 'SingleStore',
  executor(next, args) {
    const key = args.identifier.getIdentifier();

    const item = store.get(key);
    if (item) return item;

    const result = next();
    store.set(key, result);

    return result;
  },
  delete(identifier) {
    if (identifier) {
      const item = store.get(identifier);
      if (item) {
        item?.dispose();
        store.delete(identifier);
      }
    } else {
      Array.from(store.values()).forEach((item) => item?.dispose());
      store.clear();
    }
  },
};
