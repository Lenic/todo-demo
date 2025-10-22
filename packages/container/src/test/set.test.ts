import type { IContainer } from '../types';

import { describe, expect, test } from '@jest/globals';

import { ContainerLifetimeTypes } from '../constants';
import { Container } from '../container';
import { ExternalLifetime, WeakExternalStorage } from '../lifetimes';

import { IAnimal, Tiger, weakKey } from './classes';

describe('test set method', () => {
  test('first is true', () => {
    const container: IContainer = new Container();
    const result = container.set(IAnimal, { creator: Tiger, dependencies: [] });

    expect(result).toBe(true);
  });

  test('others is false', () => {
    const container: IContainer = new Container();
    const result1 = container.set(IAnimal, { creator: Tiger, dependencies: [] });
    const result2 = container.set(IAnimal, { creator: Tiger, dependencies: [] });
    const result3 = container.set(IAnimal, { creator: Tiger, dependencies: [] });

    expect(result1).toBe(true);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
  });

  test('override', () => {
    const container: IContainer = new Container();
    const result1 = container.set(IAnimal, { creator: Tiger, dependencies: [] });
    const result2 = container.set(IAnimal, { creator: Tiger, dependencies: [] }, true);
    const result3 = container.set(IAnimal, { creator: Tiger, dependencies: [] }, true);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
  });

  test('different lifetime: single and transaction', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Single);
    const result = container.set(IAnimal, {
      creator: Tiger,
      dependencies: [],
      lifetimeName: ContainerLifetimeTypes.Transaction,
    });

    expect(result).toBe(true);

    expect(container.get(IAnimal) === container.get(IAnimal)).toBeFalsy();
  });

  test('different lifetime: transaction and single', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    const result = container.set(IAnimal, {
      creator: Tiger,
      dependencies: [],
      lifetimeName: ContainerLifetimeTypes.Single,
    });

    expect(result).toBe(true);

    expect(container.get(IAnimal) === container.get(IAnimal)).toBe(true);
  });

  test('different lifetime: transaction and weak', async () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    const weakLifetime = new ExternalLifetime(storage);

    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction, weakLifetime);

    const result = container.set(IAnimal, {
      creator: Tiger,
      dependencies: [],
      lifetimeName: weakLifetime.name,
    });

    expect(result).toBe(true);

    const tiger1 = container.get(IAnimal);
    const tiger2 = container.get(IAnimal);
    expect(tiger1 === tiger2).toBe(true);

    await weakKey.gc(storage);

    const tiger3 = container.get(IAnimal);
    expect(tiger2 === tiger3).toBe(false);
  });
});
