import type { IContainerIdentifier, IRegistration, TConstructor } from './types';

export class Container {
  private registrations = new Map<string | symbol, IRegistration>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
  private instances = new Map<string | symbol, any>();

  /**
   * register a new container item. it'll be ignored if there is a same registration.
   * @param identifier {string|symbol} - the registration identifier
   * @param constructor {TConstructor<T>} - the constructor of the class
   * @param dependencies {IContainerIdentifier<any>[]} - the dependencies of the constructor
   * @return the current container instance
   */
  add<TInterface, TClass extends TInterface>(
    identifier: IContainerIdentifier<TInterface>,
    constructor: TConstructor<TClass>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
    dependencies: IContainerIdentifier<any>[] = [],
  ) {
    const key = identifier.getIdentifier();
    if (this.registrations.has(key)) return;

    this.registrations.set(key, { constructor, dependencies });

    return this;
  }

  /**
   * register a new container item or update a existed container item.
   * @param identifier {string|symbol} - the registration identifier
   * @param constructor {TConstructor<T>} - the constructor of the class
   * @param dependencies {IContainerIdentifier<any>[]} - the dependencies of the constructor
   * @return the current container instance
   */
  set<TInterface, TClass extends TInterface>(
    identifier: IContainerIdentifier<TInterface>,
    constructor: TConstructor<TClass>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
    dependencies: IContainerIdentifier<any>[] = [],
  ) {
    this.remove(identifier);
    this.registrations.set(identifier.getIdentifier(), { constructor, dependencies });

    return this;
  }

  /**
   * remove the registration from the current container.
   * @param identifier {string|symbol} - the registration identifier
   */
  remove<TInterface>(identifier: IContainerIdentifier<TInterface>) {
    const key = identifier.getIdentifier();
    if (this.instances.has(key)) {
      const item = this.instances.get(key);
      item?.dispose();

      this.instances.delete(key);
    }
  }

  /**
   * remove all of registrations from the current container.
   */
  clear() {
    this.instances.forEach((item) => item?.dispose());
    this.instances.clear();
  }

  /**
   * get the container item.
   * @param identifier {string|symbol} - the registration identifier
   * @returns the container item.
   */
  get<TInterface>(identifier: IContainerIdentifier<TInterface>): TInterface {
    const key = identifier.getIdentifier();
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }

    const registration = this.registrations.get(key);
    if (!registration) {
      throw new Error(`[Registration Error]: not find the registration of the ${key.toString()}`);
    }

    const params = registration.dependencies.map((depToken) => this.get(depToken));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- this is the core code.
    const instance = new registration.constructor(...params);
    this.instances.set(key, instance);
    return instance;
  }
}
