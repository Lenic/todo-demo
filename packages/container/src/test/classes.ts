import type { IExternalStorage } from '../lifetimes';

import { Disposable } from '../disposable';
import { createIdentifier } from '../main';

export interface IAnimal {
  run(): string;
}
export const IAnimal = createIdentifier<IAnimal>(Symbol('IAnimal'));

export const TigerRunString = 'tiger run';
export class Tiger implements IAnimal {
  run() {
    return TigerRunString;
  }
}

export const DuckRunString = 'duck run';
export class Duck extends Disposable implements IAnimal {
  run() {
    return DuckRunString;
  }
}

export interface IZoo {
  train(): string;
}
export const IZoo = createIdentifier<IZoo>(Symbol('IZoo'));
export class Zoo implements IZoo {
  constructor(private animal: IAnimal) {}
  train() {
    return this.animal.run();
  }
}

export interface IFarm {
  duck1: IAnimal;
  duck2: IAnimal;
}
export const IFarm = createIdentifier<IFarm>(Symbol('IFarm'));
export class Farm implements IFarm {
  constructor(
    public duck1: IAnimal,
    public duck2: IAnimal,
  ) {}
}

export const weakKey = {
  key: {},
  async gc(storage: IExternalStorage) {
    this.key = {};

    if (global.gc) {
      for (let i = 0; i < 10; i++) {
        global.gc();
        await new Promise((r) => setTimeout(r, 10));
      }
    }

    for (let i = 0; storage.tryGetMap() !== undefined; i++) {
      await new Promise((r) => setTimeout(r, 100));
    }
  },
};
