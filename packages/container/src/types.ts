import type { CONTAINER_IDENTIFIER_KEY } from './constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars -- used for generic type
export interface IContainerIdentifier<T> {
  [CONTAINER_IDENTIFIER_KEY]: string | symbol;

  getIdentifier(): string | symbol;
  toString(): string;
}

export interface IDisposable {
  dispose(): void;
}
