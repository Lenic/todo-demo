import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export enum EThemeColor {
  NEUTRAL = 'neutral',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
}

export interface IThemeColorService {
  themeColor: EThemeColor;
  themeColor$: Observable<EThemeColor>;

  initialize(): void;
  setThemeColor: (theme: EThemeColor) => void;
}
export const IThemeColorService = createIdentifier<IThemeColorService>(Symbol('IThemeColorService'));
