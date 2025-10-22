import type { CONTAINER_IDENTIFIER_KEY } from './constants';
import type { ComposePluginFullConfig } from '@lenic/compose';

export interface IContainerIdentifier<_T = unknown> {
  [CONTAINER_IDENTIFIER_KEY]: string | symbol;

  getIdentifier(): string | symbol;
  toString(): string;
}

/**
 * Disposable interface
 */
export interface IDisposable {
  /**
   * Whether the disposable is disposed
   */
  readonly disposed: boolean;

  /**
   * Dispose the disposable
   */
  dispose(): void;
}

/**
 * Subscription interface
 */
export interface ISubscription {
  /**
   * Unsubscribe the subscription
   */
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

/**
 * Registration interface
 */
export interface IRegistration<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInstance = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends any[] = any[],
> {
  /**
   * The creator of the registration
   */
  readonly creator: TConstructor<TInstance, TArgs>;
  /**
   * The dependencies of the registration
   */
  readonly dependencies: TConstructorParameters<TInstance, TArgs>;
  /**
   * The lifetime name of the registration
   */
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

/**
 * Container interface
 */
export interface IContainer extends IDisposable {
  /**
   * Append lifetimes to the container
   * @param lifetimes - The lifetimes to append
   */
  appendLifetimes(...lifetimes: ILifetime[]): void;

  /**
   * Delete identifiers from the container, if the identifiers is empty, delete all identifiers
   * @param identifiers - The identifiers to delete
   */
  delete<TInterface>(...identifiers: IContainerIdentifier<TInterface>[]): void;

  /**
   * Get a instance from the container
   * @param identifier - The identifier of the instance, if the identifier is not set, throw an error
   * @returns The instance
   */
  get<TInterface>(identifier: IContainerIdentifier<TInterface>): TInterface;

  /**
   * Set a registration to the container
   * @param identifier - The identifier of the registration
   * @param registration - The registration to set
   * @param force - Whether to force the registration, default is false
   * @returns Whether the registration is set successfully
   */
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

  /**
   * Set the default lifetime name of the container, if the default lifetime name is not set, throw an error
   * @param lifetimeName - The default lifetime name
   */
  setDefaultLifetimeName(lifetimeName: string): void;
}
