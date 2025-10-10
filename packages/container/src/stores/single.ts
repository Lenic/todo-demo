import type { IInstanceContext, IInstanceStore } from '../types';
import type { ComposePlugin } from '@lenic/compose';

export class SingleStore implements IInstanceStore {
  private _store: Map<string | symbol, unknown>;

  plugin: ComposePlugin<unknown, IInstanceContext>;

  constructor() {
    this._store = new Map<string | symbol, unknown>();

    this.plugin = {
      order: 0,
      desc: 'SingleStore',
      executor: (next, args) => {
        const key = args.identifier.getIdentifier();

        const item = this._store.get(key);
        if (item) return item;

        const result = next();
        this._store.set(key, result);

        return result;
      },
    };
  }
}
