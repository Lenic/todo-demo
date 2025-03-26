import type { TTodoItemChangedEvent } from './types';

import { Subject } from 'rxjs';

export const dataNotification = new Subject<TTodoItemChangedEvent>();
