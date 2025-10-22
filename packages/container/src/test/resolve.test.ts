import type { IContainer } from '../types';

import { describe, expect, test } from '@jest/globals';

import { ContainerLifetimeTypes } from '../constants';
import { Container } from '../container';
import { ExternalLifetime, WeakExternalStorage } from '../lifetimes';

import { IAnimal, IZoo, Tiger, TigerRunString, weakKey, Zoo } from './classes';

describe('resolve test', () => {
  test('direct in single', () => {
    const container: IContainer = new Container();
    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger = container.get(IAnimal);
    expect(tiger).toBeTruthy();

    expect(tiger.run()).toBe(TigerRunString);
  });

  test('nested in sigle', () => {
    const container: IContainer = new Container();
    container.set(IAnimal, { creator: Tiger, dependencies: [] });
    container.set(IZoo, { creator: Zoo, dependencies: [IAnimal] });

    const zoo = container.get(IZoo);
    expect(zoo).toBeTruthy();

    expect(zoo.train()).toBe(TigerRunString);
  });

  test('direct in transaction', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger = container.get(IAnimal);
    expect(tiger).toBeTruthy();

    expect(tiger.run()).toBe(TigerRunString);
  });

  test('nested in transaction', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Tiger, dependencies: [] });
    container.set(IZoo, { creator: Zoo, dependencies: [IAnimal] });

    const zoo = container.get(IZoo);
    expect(zoo).toBeTruthy();

    expect(zoo.train()).toBe(TigerRunString);
  });

  test('direct in weak', () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    const weakLifetime = new ExternalLifetime(storage);
    const container: IContainer = new Container(weakLifetime.name, weakLifetime);

    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger = container.get(IAnimal);
    expect(tiger).toBeTruthy();

    expect(tiger.run()).toBe(TigerRunString);
  });

  test('nested in weak', () => {
    const storage = new WeakExternalStorage(() => weakKey.key);

    const weakLifetime = new ExternalLifetime(storage);
    const container: IContainer = new Container(weakLifetime.name, weakLifetime);

    container.set(IAnimal, { creator: Tiger, dependencies: [] });
    container.set(IZoo, { creator: Zoo, dependencies: [IAnimal] });

    const zoo = container.get(IZoo);
    expect(zoo).toBeTruthy();

    expect(zoo.train()).toBe(TigerRunString);
  });
});
