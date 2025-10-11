import type { IContainer, IContainerIdentifier } from './types';

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
