import type { IContainer, IContainerIdentifier } from './types';

import { CONTAINER_IDENTIFIER_KEY } from './constants';

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

  container: IContainer | null = null;

  get<T>(identifier: IContainerIdentifier<T>) {
    return this.container?.get<T>(identifier);
  }

  clear() {
    this.container?.delete();
  }
}
