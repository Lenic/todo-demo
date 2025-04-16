import type { IContainerIdentifier, TInjectedParameter } from './types';
import type { Newable } from 'inversify';

import { Container, inject } from 'inversify';

import { CONTAINER_IDENTIFIER_KEY } from './constants';

const container = new Container({ defaultScope: 'Singleton' });

export const injectWith = <T>(identifier: IContainerIdentifier<T>) =>
  inject(identifier.getIdentifier()) as TInjectedParameter<T>;

export const injectableWith =
  <T>(identifier: IContainerIdentifier<T>) =>
  <TClass>(target: Newable<TClass>) => {
    console.log('register class to ioc:', identifier.getIdentifier(), target.name);
    container.bind(identifier.getIdentifier()).to(target);
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
    if (name === undefined) {
      return container.get<T>(identifier.getIdentifier());
    } else {
      return container.get<T>(identifier.getIdentifier(), { name });
    }
  }

  getAll<T>(identifier: IContainerIdentifier<T>, name?: string | number | symbol) {
    if (name === undefined) {
      return container.getAll<T>(identifier.getIdentifier());
    } else {
      return container.getAll<T>(identifier.getIdentifier(), { name });
    }
  }

  dispose() {
    container.unbindAll();
  }
}
