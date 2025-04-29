import { register } from '@todo/container';
import { IDataService, IDataStorageService, IThemeService } from '@todo/interface';

import { IndexedDBDataStorageService } from './api';
import { DataService, ThemeService } from './resources';

register(IDataStorageService, IndexedDBDataStorageService);
register(IDataService, DataService, [IDataStorageService]);
register(IThemeService, ThemeService);
