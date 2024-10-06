import type { CONTAINER_IDENTIFIER_KEY } from './constants';

export interface IContainerIdentifier<T = any> {
  [CONTAINER_IDENTIFIER_KEY]: string | symbol;

  getIdentifier(): string | symbol;
  toString(): string;
}

export interface IDisposable {
  dispose(): void;
}
