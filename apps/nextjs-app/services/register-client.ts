import { register } from '@todo/container';
import { IDataService, IThemeService } from '@todo/interface';

import { DataService, ThemeService } from './resources';

register(IDataService, DataService);
register(IThemeService, ThemeService);
