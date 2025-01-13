import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export enum ETheme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

export enum EThemeColor {
  NEUTRAL = 'neutral',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
}

export interface IThemeService {
  theme: ETheme;
  theme$: Observable<ETheme>;

  color: EThemeColor;
  color$: Observable<EThemeColor>;

  initialize(): void;
  setTheme: (theme: ETheme) => void;
  setColor: (theme: EThemeColor) => void;
}
export const IThemeService = createIdentifier<IThemeService>(Symbol('IThemeService'));
