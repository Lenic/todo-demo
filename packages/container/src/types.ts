import type { CONTAINER_IDENTIFIER_KEY } from './constants';
import type { ComposePluginFullConfig } from '@lenic/compose';

export interface IContainerIdentifier<_T = unknown> {
  [CONTAINER_IDENTIFIER_KEY]: string | symbol;

  getIdentifier(): string | symbol;
  toString(): string;
}

export interface IDisposable {
  disposed: boolean;

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

export interface IInstanceContext
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Record<string | symbol, any> {
  identifier: IContainerIdentifier;
  lifetimeName: string;
}

export interface ILifetime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Omit<ComposePluginFullConfig<any, IInstanceContext>, 'desc'> {
  readonly name: string;
  delete(identifiers: IContainerIdentifier[]): void;
}

export interface IRegistration<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInstance = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends any[] = any[],
> {
  readonly creator: TConstructor<TInstance, TArgs>;
  readonly dependencies: TConstructorParameters<TInstance, TArgs>;
  readonly lifetimeName?: string;
}

export interface IRegistrationWithLifetime<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInstance = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends any[] = any[],
> extends Omit<IRegistration<TInstance, TArgs>, 'lifetimeName'> {
  readonly lifetime: ILifetime;
}

export interface IContainer extends IDisposable {
  get<TInterface>(identifier: IContainerIdentifier<TInterface>): TInterface;

  setDefaultLifetimeName(lifetimeName: string): void;

  set<
    TInterface,
    TInstance extends TInterface,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TArgs extends any[],
  >(
    identifier: IContainerIdentifier<TInterface>,
    registration: IRegistration<TInstance, TArgs>,
    force?: boolean,
  ): boolean;

  delete<TInterface>(...identifiers: IContainerIdentifier<TInterface>[]): void;
}
