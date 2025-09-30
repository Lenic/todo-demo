import type { Session } from '@auth/core/types';

import { useAuth } from '~/hooks/auth';
import { defineNuxtPlugin, useRequestEvent } from '#imports';

export default defineNuxtPlugin(async () => {
  const { session, status } = useAuth();

  const event = useRequestEvent();
  if (!event) return;

  const data = await $fetch<Session | null>('/api/auth/session', { headers: event.headers });
  event.context.session = data;

  if (data && Object.keys(data).length > 0) {
    session.value = data;
    status.value = 'authenticated';
  } else {
    session.value = null;
    status.value = 'unauthenticated';
  }
});
