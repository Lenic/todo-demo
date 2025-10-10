import type { IContainerRegistration, IContainerIdentifier, IRegistration, ISubscription, TConstructor, IInstanceStore } from './types';

export class Container implements IContainerRegistration {
  private registrations = new Map<string | symbol, IRegistration>();
  private stores = new Map<string | symbol, IInstanceStore>();
  private disposableList = new Set<(() => void) | ISubscription>();

  trySet<TInterface, TClass extends TInterface & TConstructor>(
    identifier: IContainerIdentifier<TInterface>,
    registration: IRegistration<TClass>,
    store?: IInstanceStore<TClass>
  ): boolean {
    const key = identifier.getIdentifier();
    if (this.registrations.has(key)) return false;

    this.registrations.set(key, registration);
    this.stores.set(key, store);

    return this;
  }

  set<TInterface, TClass extends TInterface>(
    identifier: IContainerIdentifier<TInterface>,
    constructor: TConstructor<TClass>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
    dependencies: IContainerIdentifier<any>[] = [],
  ): IContainer {
    this.remove(identifier);
    this.registrations.set(identifier.getIdentifier(), { constructor, dependencies });

    return this;
  }

  remove<TInterface>(identifier: IContainerIdentifier<TInterface>) {
    const key = identifier.getIdentifier();
    if (this.instances.has(key)) {
      const item = this.instances.get(key);
      item?.dispose();

      this.instances.delete(key);
    }
  }

  disposeWithMe(subscription: (() => void) | ISubscription): IContainer {
    this.disposableList.add(subscription);
    return this;
  }

  clear() {
    this.instances.forEach((item) => item?.dispose());
    this.instances.clear();

    this.disposableList.forEach((item) => {
      if (typeof item === 'function') {
        item();
      } else {
        item.unsubscribe();
      }
    });
    this.disposableList.clear();
  }

  get<TInterface>(identifier: IContainerIdentifier<TInterface>): TInterface {
    const key = identifier.getIdentifier();
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }

    const registration = this.registrations.get(key);
    if (!registration) {
      throw new Error(`[Registration Error]: not find the registration of the ${key.toString()}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
    const params = registration.dependencies.map((depToken: IContainerIdentifier<any>) => this.get(depToken));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- this is the core code.
    const instance = new registration.constructor(...params);
    this.instances.set(key, instance);
    return instance;
  }
}
