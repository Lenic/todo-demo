import type { IContainer } from '../types';

import { describe, expect, test } from '@jest/globals';

import { ContainerLifetimeTypes } from '../constants';
import { Container } from '../container';
import { ExternalLifetime, WeakExternalStorage } from '../lifetimes';

import { Duck, IAnimal, Tiger, weakKey } from './classes';

describe('deleting test', () => {
  test('single', () => {
    const container: IContainer = new Container();
    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger1 = container.get(IAnimal);
    expect(tiger1).toBeTruthy();

    container.delete(IAnimal);

    const tiger2 = container.get(IAnimal);
    expect(tiger2).toBeTruthy();

    expect(tiger1 === tiger2).toBe(false);
  });

  test('transaction', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger1 = container.get(IAnimal);
    expect(tiger1).toBeTruthy();

    container.delete(IAnimal);

    const tiger2 = container.get(IAnimal);
    expect(tiger2).toBeTruthy();

    expect(tiger1 === tiger2).toBe(false);
  });

  test('weak', async () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    const weakLifetime = new ExternalLifetime(storage);
    const container: IContainer = new Container(weakLifetime.name, weakLifetime);

    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger1 = container.get(IAnimal);
    expect(tiger1).toBeTruthy();

    const tiger2 = container.get(IAnimal);
    expect(tiger1 === tiger2).toBeTruthy();

    await weakKey.gc(storage);

    const tiger3 = container.get(IAnimal);
    expect(tiger3).toBeTruthy();

    expect(tiger2 === tiger3).toBe(false);
  });

  test('disposeable in single', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Single);
    container.set(IAnimal, { creator: Duck, dependencies: [] });

    const duck = container.get(IAnimal);
    expect(duck).toBeTruthy();

    container.delete(IAnimal);

    expect((duck as Duck).disposed).toBe(true);
  });

  test('disposeable in transaction', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Duck, dependencies: [] });

    const duck = container.get(IAnimal);
    expect(duck).toBeTruthy();

    container.delete(IAnimal);

    expect((duck as Duck).disposed).toBe(false);
  });

  test('disposeable in weak', () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    const weakLifetime = new ExternalLifetime(storage);
    const container: IContainer = new Container(weakLifetime.name, weakLifetime);

    container.set(IAnimal, { creator: Duck, dependencies: [] });

    const duck = container.get(IAnimal);
    expect(duck).toBeTruthy();

    container.delete(IAnimal);

    expect((duck as Duck).disposed).toBe(true);
  });
});
