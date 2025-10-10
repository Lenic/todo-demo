import type { ContainerizedConstructorParameters, IContainerIdentifier, SubscriptionLike, TConstructor } from './types';

import { CONTAINER_IDENTIFIER_KEY } from './constants';
import { Container } from './container';

const container = new Container();

export function register<TInterface, TClass extends TInterface & (abstract new (...args: any) => any)>(
  identifier: IContainerIdentifier<TInterface>,
  target: TConstructor<TClass>,
  dependencies: ContainerizedConstructorParameters<TClass>,
) {
  container.add(identifier, target, dependencies);
}

export function createIdentifier<T>(key: string | symbol) {
  const idendifier: IContainerIdentifier<T> = {
    [CONTAINER_IDENTIFIER_KEY]: key,
    getIdentifier() {
      return key;
    },
    toString() {
      return key.toString();
    },
  };
  return idendifier;
}

export class ServiceLocator {
  static default = new ServiceLocator();

  get<T>(identifier: IContainerIdentifier<T>) {
    return container.get<T>(identifier);
  }

  disposeWithMe(subscription: (() => void) | SubscriptionLike) {
    container.disposeWithMe(subscription);
  }

  clear() {
    container.clear();
  }
}
