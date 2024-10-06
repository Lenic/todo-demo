import type { IContainerIdentifier } from './types';
import type { interfaces } from 'inversify';

import { Container, injectable } from 'inversify';

import { CONTAINER_IDENTIFIER_KEY } from './constants';

const container = new Container({ defaultScope: 'Singleton' });

export const injectableWith =
  <T>(identifier: IContainerIdentifier<T>) =>
  <TClass>(target: interfaces.Newable<TClass>) => {
    container.bind(identifier.getIdentifier()).to(injectable()(target));

    return target;
  };

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

  get<T>(identifier: IContainerIdentifier<T>): T;
  get<T>(identifier: IContainerIdentifier<T>, name: string | number | symbol): T;
  get<T>(identifier: IContainerIdentifier<T>, name?: string | number | symbol) {
    if (name === null || name === undefined) {
      return container.get<T>(identifier.getIdentifier());
    } else {
      return container.getNamed(identifier.getIdentifier(), name);
    }
  }

  getAll<T>(identifier: IContainerIdentifier<T>): T;
  getAll<T>(identifier: IContainerIdentifier<T>, name: string | number | symbol): T;
  getAll<T>(identifier: IContainerIdentifier<T>, name?: string | number | symbol) {
    if (name === null || name === undefined) {
      return container.getAll<T>(identifier.getIdentifier());
    } else {
      return container.getAllNamed(identifier.getIdentifier(), name);
    }
  }
}
