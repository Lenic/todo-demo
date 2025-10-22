export const CONTAINER_IDENTIFIER_KEY = Symbol('CONTAINER_IDENTIFIER_KEY');

/**
 * Container lifetime types constant, custom the lifetime types isn't contained in this constant
 *
 * @description: The constants for the container lifetime types
 * @example:
 * ```typescript
 * import { ContainerLifetimeTypes } from '@lenic/container';
 *
 * const container = new Container(ContainerLifetimeTypes.Single);
 * ```
 */
export const ContainerLifetimeTypes = {
  /**
   * Single lifetime type
   */
  Single: 'single',
  /**
   * Transaction lifetime type
   */
  Transaction: 'transaction',
} as const;
