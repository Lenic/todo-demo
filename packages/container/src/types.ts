import type { CONTAINER_IDENTIFIER_KEY, ContainerLifetimeTypes } from './constants';
import type { ComposePluginFullConfig } from '@lenic/compose';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TConstructor<TInstance, TArgs extends any[]> = new (...args: TArgs) => TInstance;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TConstructorParameters<TInstance, TArgs extends any[]> =
  ConstructorParameters<TConstructor<TInstance, TArgs>> extends [...infer P]
    ? { [K in keyof P]: IContainerIdentifier<P[K]> }
    : [];

export interface IContainerStore<TLifetimeType extends TContainerLifetimeTypes = TContainerLifetimeTypes>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends ComposePluginFullConfig<any, IInstanceContext<TLifetimeType>> {
  delete(identifier?: string | symbol): void;
}

export interface IRegistration<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInstance = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends any[] = any[],
> {
  readonly creator: TConstructor<TInstance, TArgs>;
  readonly dependencies: TConstructorParameters<TInstance, TArgs>;
}

export type TContainerLifetimeTypes = (typeof ContainerLifetimeTypes)[keyof typeof ContainerLifetimeTypes];

export interface IInstanceContext<TLifetimeType extends TContainerLifetimeTypes = TContainerLifetimeTypes>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Record<string | symbol, any> {
  lifetimeType: TLifetimeType;
  identifier: IContainerIdentifier;
  registration: IRegistration;
}

export interface IContainer<TLifetimeType extends TContainerLifetimeTypes = TContainerLifetimeTypes>
  extends IDisposable {
  get<TInterface>(identifier: IContainerIdentifier<TInterface>): TInterface;

  set<
    TInterface,
    TInstance extends TInterface,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TArgs extends any[],
  >(
    identifier: IContainerIdentifier<TInterface>,
    registration: IRegistration<TInstance, TArgs>,
    lifetimeType?: TLifetimeType,
    force?: boolean,
  ): boolean;

  delete<TInterface>(identifier?: IContainerIdentifier<TInterface>): void;
}
