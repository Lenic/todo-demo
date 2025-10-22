import type { IContainerIdentifier, IInstanceContext, ILifetime } from '../types';

/**
 * External storage interface
 */
export interface IExternalStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tryGetMap(): Map<IContainerIdentifier, any> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMap(): Map<IContainerIdentifier, any>;
}

/**
 * WeakMap external storage class
 */
export class WeakExternalStorage implements IExternalStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanupCallback: ((heldValue: Map<IContainerIdentifier, any>) => void) | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store = new WeakMap<object, Map<IContainerIdentifier, any>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registry = new FinalizationRegistry((heldValue: Map<IContainerIdentifier, any>) => {
    this.cleanupCallback?.(heldValue);
  });

  /**
   * Constructor of WeakExternalStorage
   * @param getKey - The function to get the key of the external storage
   */
  constructor(private getKey: () => object) {
    this.cleanupCallback = undefined;
  }

  /**
   * Try to get the map of the external storage
   * @returns The map of the external storage
   */
  tryGetMap() {
    return this.store.get(this.getKey());
  }

  /**
   * Get the map of the external storage
   * @returns The map of the external storage
   */
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

  /**
   * On cleanup callback
   * @param cleanupCallback - The callback to cleanup the external storage
   * @returns The function to unsubscribe the cleanup callback
   */
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

/**
 * External lifetime class
 */
export class ExternalLifetime implements ILifetime {
  /**
   * Constructor of ExternalLifetime
   * @param storage - The storage of the external lifetime
   * @param order - The order of the external lifetime
   * @param name - The name of the external lifetime
   */
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
