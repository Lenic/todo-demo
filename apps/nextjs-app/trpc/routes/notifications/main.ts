import type { IChangedItemInfo } from './types';

import { Subject } from 'rxjs';

export const dataNotification = new Subject<IChangedItemInfo>();
