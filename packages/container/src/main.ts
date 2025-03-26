import type { IContainerIdentifier, TInjectedParameter } from './types';
import type { interfaces } from 'inversify';

import { Container, inject, injectable } from 'inversify';

import { CONTAINER_IDENTIFIER_KEY } from './constants';

const container = new Container({ defaultScope: 'Singleton' });

export const injectWith = <T>(identifier: IContainerIdentifier<T>) =>
  inject(identifier.getIdentifier()) as TInjectedParameter<T>;

export const injectableWith =
  <T>(identifier: IContainerIdentifier<T>, isDefault: boolean = true) =>
  <TClass>(target: interfaces.Newable<TClass>) => {
    const local = identifier.getIdentifier();
    const id = typeof local === 'symbol' ? local.description : local;
    /**
     * the config value in `process.env`
     */
    const value = process.env[`INJECT_CLASS_${id}`];
    /**
     * - inject if there's no config and the current target class is the default.
     * - inject if there exists a config and the current target class is equal to the config value.
     * - ignore other conditions.
     */
    if ((!value && isDefault) || (value && value === target.name)) {
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

  dispose() {
    container.unbindAll();
  }
}
