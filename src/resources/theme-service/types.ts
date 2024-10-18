import type { Observable } from 'rxjs';

import { createIdentifier } from '@/lib/injector';

export enum ETheme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

export interface IThemeService {
  theme: ETheme;
  theme$: Observable<ETheme>;

  initialize(): void;
  setTheme: (theme: ETheme) => void;
}
export const IThemeService = createIdentifier<IThemeService>(Symbol('IThemeService'));
