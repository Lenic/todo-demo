import { register } from '@todo/container';
import { IThemeService } from '@todo/interface';

// import { /*DataService, IDBDataService, */ ThemeService } from './resources';
import { ThemeService } from './resources/theme-service';

export const registerClientService = () => {
  //   register(IDBDataService, DataService);
  register(IThemeService, ThemeService);
};
