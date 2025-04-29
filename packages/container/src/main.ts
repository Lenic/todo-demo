import type { IContainerIdentifier, TConstructor } from './types';

import { CONTAINER_IDENTIFIER_KEY } from './constants';
import { Container } from './container';

const container = new Container();

export function register<TInterface, TClass extends TInterface>(
  identifier: IContainerIdentifier<TInterface>,
  target: TConstructor<TClass>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the core code.
  dependencies: IContainerIdentifier<any>[] = [],
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

  clear() {
    container.clear();
  }
}
