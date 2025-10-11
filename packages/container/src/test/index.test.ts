import type { IContainer } from '../types';

import { describe, expect, test } from '@jest/globals';

import { ContainerLifetimeTypes } from '../constants';
import { Container } from '../container';

import { Duck, Farm, IAnimal, IFarm, IZoo, Tiger, TigerRunString, Zoo } from './classes';

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
    const result2 = container.set(IAnimal, { creator: Tiger, dependencies: [] }, undefined, true);
    const result3 = container.set(IAnimal, { creator: Tiger, dependencies: [] }, undefined, true);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
  });

  test('different lifetime 1', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Single);
    const result = container.set(IAnimal, { creator: Tiger, dependencies: [] }, ContainerLifetimeTypes.Transaction);

    expect(result).toBe(true);

    expect(container.get(IAnimal) === container.get(IAnimal)).toBeFalsy();
  });

  test('different lifetime 2', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    const result = container.set(IAnimal, { creator: Tiger, dependencies: [] }, ContainerLifetimeTypes.Single);

    expect(result).toBe(true);

    expect(container.get(IAnimal) === container.get(IAnimal)).toBe(true);
  });
});

describe('resolve test', () => {
  test('direct', () => {
    const container: IContainer = new Container();
    container.set(IAnimal, { creator: Tiger, dependencies: [] });

    const tiger = container.get(IAnimal);
    expect(tiger).toBeTruthy();

    expect(tiger.run()).toBe(TigerRunString);
  });

  test('nested', () => {
    const container: IContainer = new Container();
    container.set(IAnimal, { creator: Tiger, dependencies: [] });
    container.set(IZoo, { creator: Zoo, dependencies: [IAnimal] });

    const zoo = container.get(IZoo);
    expect(zoo).toBeTruthy();

    expect(zoo.train()).toBe(TigerRunString);
  });
});

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
});

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

  test('disposeable 1', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Single);
    container.set(IAnimal, { creator: Duck, dependencies: [] });

    const duck = container.get(IAnimal);
    expect(duck).toBeTruthy();

    container.delete(IAnimal);

    expect((duck as Duck).disposed).toBe(true);
  });

  test('disposeable 2', () => {
    const container: IContainer = new Container(ContainerLifetimeTypes.Transaction);
    container.set(IAnimal, { creator: Duck, dependencies: [] });

    const duck = container.get(IAnimal);
    expect(duck).toBeTruthy();

    container.delete(IAnimal);

    expect((duck as Duck).disposed).toBe(false);
  });
});
