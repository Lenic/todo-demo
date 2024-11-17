import type { interfaces } from 'inversify';
import type { IContainerIdentifier } from './types';

import { Container, inject, injectable } from 'inversify';

import { CONTAINER_IDENTIFIER_KEY } from './constants';

const container = new Container({ defaultScope: 'Singleton' });

export const injectWith = <T>(identifier: IContainerIdentifier<T>) => inject(identifier.getIdentifier());

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

  get<T>(identifier: IContainerIdentifier<T>, name?: string | number | symbol) {
    debugger;
    if (name === undefined) {
      return container.get<T>(identifier.getIdentifier());
    } else {
      return container.getNamed<T>(identifier.getIdentifier(), name);
    }
  }

  getAll<T>(identifier: IContainerIdentifier<T>, name?: string | number | symbol) {
    if (name === undefined) {
      return container.getAll<T>(identifier.getIdentifier());
    } else {
      return container.getAllNamed<T>(identifier.getIdentifier(), name);
    }
  }
}
