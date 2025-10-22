import type { IContainerIdentifier, IInstanceContext, ILifetime } from '../types';

export interface IExternalStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tryGetMap(): Map<IContainerIdentifier, any> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMap(): Map<IContainerIdentifier, any>;
}

export class WeakExternalStorage implements IExternalStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanupCallback: ((heldValue: Map<IContainerIdentifier, any>) => void) | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store = new WeakMap<object, Map<IContainerIdentifier, any>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registry = new FinalizationRegistry((heldValue: Map<IContainerIdentifier, any>) => {
    this.cleanupCallback?.(heldValue);
  });

  constructor(private getKey: () => object) {
    this.cleanupCallback = undefined;
  }

  tryGetMap() {
    return this.store.get(this.getKey());
  }

  getMap() {
    let map = this.tryGetMap();
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map = new Map<IContainerIdentifier, any>();

      const key = this.getKey();
      this.store.set(key, map);
      this.registry.register(key, map);
    }
    return map;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCleanup(cleanupCallback: (heldValue: Map<IContainerIdentifier, any>) => void) {
    this.cleanupCallback = cleanupCallback;

    return () => {
      if (this.cleanupCallback === cleanupCallback) {
        this.cleanupCallback = undefined;
      }
    };
  }
}

export class ExternalLifetime implements ILifetime {
  constructor(
    private storage: IExternalStorage,
    public order = 0,
    public name = 'external',
  ) {}

  delete(identifiers: IContainerIdentifier[]) {
    const currentStore = this.storage.tryGetMap();
    if (!currentStore) return;

    if (identifiers.length) {
      identifiers.forEach((identifier) => {
        const item = currentStore.get(identifier);
        if (item) {
          item.dispose?.();
          currentStore.delete(identifier);
        }
      });
    } else {
      Array.from(currentStore.values()).forEach((item) => item?.dispose?.());
      currentStore.clear();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executor = (next: (config?: IInstanceContext) => any, args: IInstanceContext) => {
    if (args.lifetimeName !== this.name) return next();

    const currentStore = this.storage.getMap();
    const item = currentStore.get(args.identifier);
    if (item) return item;

    const result = next();
    currentStore.set(args.identifier, result);

    return result;
  };
}
