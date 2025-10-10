import type { CONTAINER_IDENTIFIER_KEY } from './constants';
import type { ComposePlugin } from '@lenic/compose';

export interface IContainerIdentifier<_T = unknown> {
  [CONTAINER_IDENTIFIER_KEY]: string | symbol;

  getIdentifier(): string | symbol;
  toString(): string;
}

export interface IDisposable {
  dispose(): void;
}

export interface ISubscription {
  unsubscribe(): void;
}

export interface IContainer {
  get<TInterface>(identifier: IContainerIdentifier<TInterface>): TInterface;
  delete<TInterface>(identifier?: IContainerIdentifier<TInterface>): void;
}

export type TConstructor<TInstance = unknown, TArgs extends unknown[] = unknown[]> = new (...args: TArgs) => TInstance;

export type TConstructorParameters<T extends TConstructor> =
  ConstructorParameters<T> extends [...infer P] ? { [K in keyof P]: IContainerIdentifier<P[K]> } : [];

export interface IInstanceContext {
  container: IContainer;
  identifier: IContainerIdentifier;
  context: Record<string | symbol, unknown>;
}

export interface IInstanceStore {
  plugin: ComposePlugin<unknown, IInstanceContext>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IRegistration<TClass extends TConstructor = any> {
  creator: TConstructor<TClass>;
  dependencies: IContainerIdentifier<TClass>[];
}

export interface IContainerRegistration extends IContainer {
  trySet<TInterface, TClass extends TInterface & TConstructor>(
    identifier: IContainerIdentifier<TInterface>,
    registration: IRegistration<TClass>,
    store?: IInstanceStore<TClass>,
  ): boolean;

  set<TInterface, TClass extends TInterface & TConstructor>(
    identifier: IContainerIdentifier<TInterface>,
    registration: IRegistration<TClass>,
    store?: IInstanceStore<TClass>,
  ): IContainerRegistration;
}
