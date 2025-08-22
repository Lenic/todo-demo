import type { Adapter } from '@auth/core/adapters';

import { createIdentifier } from '@todo/container';

export const INextAuthAdapter = createIdentifier<Adapter>(Symbol('INextAuthAdapter'));
