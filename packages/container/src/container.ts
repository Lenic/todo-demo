import type {
  IContainer,
  IContainerIdentifier,
  IContainerStore,
  IInstanceContext,
  IRegistration,
  TContainerLifetimeTypes,
} from './types';
import type { ComposeInstance } from '@lenic/compose';

import { compose } from '@lenic/compose';

import { ContainerLifetimeTypes } from './constants';
import { Disposable } from './disposable';
import { singleStore, transactionStore } from './stores';

export class Container<TLifetimeType extends TContainerLifetimeTypes = TContainerLifetimeTypes>
  extends Disposable
  implements IContainer<TLifetimeType>
{
  private registrations = new Map<string | symbol, [TLifetimeType, IRegistration]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private action: ComposeInstance<any, IInstanceContext<TLifetimeType>>;
  private defaultLifetimeType: TLifetimeType;
  private storeList: IContainerStore<TLifetimeType>[];

  constructor(defaultLifetimeType?: TLifetimeType, lifetimes?: IContainerStore<TLifetimeType>[]) {
    super();

    this.defaultLifetimeType = defaultLifetimeType ?? (ContainerLifetimeTypes.Single as TLifetimeType);
    this.storeList = [singleStore, transactionStore, ...(lifetimes ?? [])] as IContainerStore<TLifetimeType>[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.action = compose<any, IInstanceContext<TLifetimeType>>((context) => {
      const { registration } = context;

      const params = registration.dependencies.map((identifier) => {
        const [lifetimeType, registration] = this.getInfo(identifier);
        return this.action({ ...context, identifier, lifetimeType, registration });
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new registration.creator(...params);
    }, this.storeList);
  }

  set(identifier: IContainerIdentifier, registration: IRegistration, lifetimeType?: TLifetimeType) {
    const key = identifier.getIdentifier();
    if (this.registrations.has(key)) return false;

    this.registrations.set(key, [lifetimeType ?? this.defaultLifetimeType, registration]);
    return true;
  }

  delete(identifier?: IContainerIdentifier) {
    Array.from(this.storeList.values()).forEach((item) => {
      item.delete(identifier?.getIdentifier());
    });
  }

  get(identifier: IContainerIdentifier) {
    const [lifetimeType, registration] = this.getInfo(identifier);
    return this.action({ identifier, lifetimeType, registration });
  }

  private getInfo(identifier: IContainerIdentifier) {
    const key = identifier.getIdentifier();

    const item = this.registrations.get(key);
    if (!item) {
      throw new Error(`[Registration Error]: not find the registration of the ${key.toString()}`);
    }
    return item;
  }
}
