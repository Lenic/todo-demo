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
