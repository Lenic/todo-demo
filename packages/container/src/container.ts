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
  private lifetimeList: ILifetime[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private action: ComposeInstance<any, IInstanceContext>;
  private registrations = new Map<string | symbol, IRegistrationWithLifetime>();

  constructor(
    private defaultLifetimeType: string = ContainerLifetimeTypes.Single,
    ...extraLifetimes: ILifetime[]
  ) {
    super();

    this.lifetimeList = [singleLifetime, transactionLifetime, ...extraLifetimes] as ILifetime[];
    this.action = this.buildAction();

    this.disposeWithMe(() => {
      this.delete();
    });
  }

  setDefaultLifetimeName(lifetimeName: string) {
    if (!this.lifetimeList.some((v) => v.name === lifetimeName)) {
      throw new Error(`[Container]: can't find the lifetime name of ${lifetimeName}`);
    }
    this.defaultLifetimeType = lifetimeName;
  }

  appendLifetimes(...lifetimes: ILifetime[]) {
    const set = new Set(lifetimes.map((v) => v.name));
    if (set.size !== lifetimes.length) {
      throw new Error('[Container]: new lifetimes contain duplicated names.');
    }

    this.lifetimeList.forEach((v) => set.add(v.name));
    if (this.lifetimeList.length + lifetimes.length !== set.size) {
      throw new Error('[Container]: new lifetimes contain duplicated names from the original lifetimes.');
    }

    this.lifetimeList = [...this.lifetimeList, ...lifetimes];
    this.action = this.buildAction();
  }

  set(identifier: IContainerIdentifier, registration: IRegistration, force?: boolean) {
    const key = identifier.getIdentifier();
    const existed = this.registrations.has(key);
    if (!force && existed) return false;

    if (existed && force) {
      this.delete(identifier);
    }

    const lifetimeName = registration.lifetimeName ?? this.defaultLifetimeType;
    const lifetime = this.lifetimeList.find((v) => v.name === lifetimeName);
    if (!lifetime) {
      throw new Error(`[Container]: can't find the lifetime by ${lifetimeName}`);
    }

    this.registrations.set(key, { ...registration, lifetime });
    return true;
  }

  delete<TInterface>(...identifiers: IContainerIdentifier<TInterface>[]) {
    this.lifetimeList.forEach((lifetime) => {
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

  protected buildAction() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return compose<any, IInstanceContext>((context) => {
      const registration = this.getInfo(context.identifier);
      const params = registration.dependencies.map((identifier) => {
        const lifetimeName = this.getInfo(identifier).lifetime.name;
        return this.action({ ...context, identifier, lifetimeName });
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new registration.creator(...params);
    }, this.lifetimeList);
  }
}
