'use client';

import { register } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { DataService, IDBDataService, ThemeService } from './resources';

register(IDBDataService, DataService);
register(IThemeService, ThemeService);
