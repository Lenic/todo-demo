'use client';

import { register } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { ContactService, DataService, IContactService, IDBDataService, ThemeService } from './resources';

register(IDBDataService, DataService);
register(IThemeService, ThemeService);
register(IContactService, ContactService);
