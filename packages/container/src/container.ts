import type {
  IContainer,
  IContainerIdentifier,
  IInstanceContext,
  ILifetime,
  IRegistration,
  IRegistrationWithLifetime,
} from './types';
import type { ComposeInstance } from '@lenic/compose';

import { compose } from '@lenic/compose';

import { ContainerLifetimeTypes } from './constants';
import { Disposable } from './disposable';
import { singleLifetime, transactionLifetime } from './lifetimes';

export class Container extends Disposable implements IContainer {
  private storeList: ILifetime[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private action: ComposeInstance<any, IInstanceContext>;
  private registrations = new Map<string | symbol, IRegistrationWithLifetime>();

  constructor(
    private defaultLifetimeType: string = ContainerLifetimeTypes.Single,
    ...extraLifetimes: ILifetime[]
  ) {
    super();

    this.storeList = [singleLifetime, transactionLifetime, ...extraLifetimes] as ILifetime[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.action = compose<any, IInstanceContext>((context) => {
      const registration = this.getInfo(context.identifier);
      const params = registration.dependencies.map((identifier) => {
        const lifetimeName = this.getInfo(identifier).lifetime.name;
        return this.action({ ...context, identifier, lifetimeName });
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new registration.creator(...params);
    }, this.storeList);

    this.disposeWithMe(() => {
      this.delete();
    });
  }

  setDefaultLifetimeName(lifetimeName: string) {
    this.defaultLifetimeType = lifetimeName;
  }

  set(identifier: IContainerIdentifier, registration: IRegistration, force?: boolean) {
    const key = identifier.getIdentifier();
    const existed = this.registrations.has(key);
    if (!force && existed) return false;

    if (existed && force) {
      this.delete(identifier);
    }

    const lifetimeName = registration.lifetimeName ?? this.defaultLifetimeType;
    const lifetime = this.storeList.find((v) => v.name === lifetimeName);
    if (!lifetime) {
      throw new Error(`[Container]: can't find the lifetime by ${lifetimeName}`);
    }

    this.registrations.set(key, { ...registration, lifetime });
    return true;
  }

  delete<TInterface>(...identifiers: IContainerIdentifier<TInterface>[]) {
    this.storeList.forEach((lifetime) => {
      lifetime.delete(identifiers);
    });
  }

  get(identifier: IContainerIdentifier) {
    const lifetimeName = this.getInfo(identifier).lifetime.name;
    return this.action({ identifier, lifetimeName });
  }

  protected getInfo(identifier: IContainerIdentifier) {
    const key = identifier.getIdentifier();

    const item = this.registrations.get(key);
    if (!item) {
      throw new Error(`[Registration Error]: not find the registration of the ${key.toString()}`);
    }
    return item;
  }
}
