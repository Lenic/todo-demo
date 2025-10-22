import type { IContainerIdentifier, ILifetime } from '../types';
import type { IExternalStorage } from './external';

import { ContainerLifetimeTypes } from '../constants';

import { ExternalLifetime } from './external';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage = new Map<IContainerIdentifier, any>();

const singleStorage: IExternalStorage = {
  tryGetMap: () => storage,
  getMap: () => storage,
};

export const singleLifetime: ILifetime = new ExternalLifetime(singleStorage, 0, ContainerLifetimeTypes.Single);
