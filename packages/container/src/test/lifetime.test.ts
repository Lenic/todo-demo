import type { IContainer } from '../types';

import { describe, expect, test } from '@jest/globals';

import { ContainerLifetimeTypes } from '../constants';
import { Container } from '../container';
import { ExternalLifetime, WeakExternalStorage } from '../lifetimes';

import { Duck, Farm, IAnimal, IFarm, Tiger, weakKey } from './classes';

describe('lifetime test', () => {
  test('single', () => {
    const container: IContainer = new Container();
    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger = container.get(IAnimal);
    expect(tiger).toBeTruthy();

    expect(tiger === container.get(IAnimal)).toBe(true);
  });

  test('transaction', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Duck, dependencies: [] });
    container.set(IFarm, { creator: Farm, dependencies: [IAnimal, IAnimal] });

    const farm = container.get(IFarm);
    expect(farm).toBeTruthy();

    expect(farm.duck1 === farm.duck2).toBe(true);
  });

  test('temporary', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Duck, dependencies: [] });

    expect(container.get(IAnimal) === container.get(IAnimal)).toBeFalsy();
  });

  test('weak', async () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    let cleaned = false;
    storage.onCleanup(() => (cleaned = true));

    const weakLifetime = new ExternalLifetime(storage);
    const container: IContainer = new Container(weakLifetime.name, weakLifetime);

    container.set(IAnimal, { creator: Duck, dependencies: [] });

    expect(container.get(IAnimal)).toBeTruthy();

    await weakKey.gc(storage);

    expect(cleaned).toBe(true);
  });

  test('weak with dispose', async () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    storage.onCleanup((map) => {
      for (const item of map.values()) {
        item?.dispose?.();
      }
      map.clear();
    });

    const weakLifetime = new ExternalLifetime(storage);
    const container: IContainer = new Container(weakLifetime.name, weakLifetime);

    container.set(IAnimal, { creator: Duck, dependencies: [] });

    const duck = container.get(IAnimal);
    expect(duck).toBeTruthy();

    await weakKey.gc(storage);

    expect((duck as Duck).disposed).toBe(true);
  });
});
