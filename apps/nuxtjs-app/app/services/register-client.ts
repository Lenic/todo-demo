import { register } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { ThemeService } from './resources/theme-service';

export const registerClientServices = () => {
  register(IThemeService, ThemeService);
};
