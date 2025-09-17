import type { Adapter } from '@auth/core/adapters';

import { createIdentifier } from '@todo/container';

export const IAuthAdapter = createIdentifier<Adapter>(Symbol('INextAuthAdapter'));
