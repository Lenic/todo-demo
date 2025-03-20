import type { IContainerIdentifier, TInjectedParameter } from './types';
import type { interfaces } from 'inversify';

import { Container, inject, injectable } from 'inversify';

import { CONTAINER_IDENTIFIER_KEY } from './constants';

const container = new Container({ defaultScope: 'Singleton' });

export const injectWith = <T>(identifier: IContainerIdentifier<T>) =>
  inject(identifier.getIdentifier()) as TInjectedParameter<T>;

export const injectableWith =
  <T>(identifier: IContainerIdentifier<T>) =>
  <TClass>(target: interfaces.Newable<TClass>) => {
    /**
     * inject the target class.
     *
     * - if `key` existed, only register it when the condition is true: `target.name === value`
     * - if `key` didn't exist, register it anyway.
     */
    const key = `INJECT_CLASS_${target.name}`;
    const value = process.env[key];
    if (!value || (value && value === target.name)) {
      container.bind(identifier.getIdentifier()).to(injectable()(target));
    }

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
