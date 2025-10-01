import type { IDBTodoItem } from '../../api';
import type { IDataService } from '@todo/interface';

import { createIdentifier } from '@todo/container';

export const IDBDataService = createIdentifier<IDataService<IDBTodoItem>>(Symbol('IDBDataService'));
