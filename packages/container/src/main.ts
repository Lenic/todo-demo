import type { IContainer, IContainerIdentifier } from './types';

import { CONTAINER_IDENTIFIER_KEY } from './constants';
import { Container } from './container';

/**
 * Create a identifier for the container
 * @param key - The key of the identifier
 * @returns The identifier
 */
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

/**
 * Service locator class
 */
export class ServiceLocator {
  /**
   * The default service locator
   */
  static default = new ServiceLocator();

  /**
   * The container of the service locator
   */
  container: IContainer;

  private constructor() {
    this.container = new Container();
  }

  /**
   * Get a instance from the container
   * @param identifier - The identifier of the instance
   * @returns The instance
   */
  get<T>(identifier: IContainerIdentifier<T>) {
    return this.container.get(identifier);
  }

  /**
   * Clear the container, delete all identifiers from the container
   *
   * - if the identifiers implement the `IDisposable` interface, the instance will be disposed
   */
  clear() {
    this.container.delete();
  }
}
