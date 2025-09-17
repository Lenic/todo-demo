import type { Session } from '@auth/core/types';

import { computed } from 'vue';

import { useState } from '#imports';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useAuth = () => {
  const session = useState<Session | null>('session', () => null);
  const status = useState<AuthStatus>('status', () => 'loading');
  const isAuthenticated = computed(() => status.value === 'authenticated');

  const fetchSession = async () => {
    try {
      const data = await $fetch<Session>('/api/auth/session');
      session.value = data;
      if (Object.keys(data).length > 0) {
        status.value = 'authenticated';
      } else {
        session.value = null;
        status.value = 'unauthenticated';
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      session.value = null;
      status.value = 'unauthenticated';
    }
  };

  const signIn = async (provider: string) => {
    const { csrfToken } = await $fetch<{ csrfToken: string }>('/api/auth/csrf');
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    const form = document.createElement('form');
    form.action = `/api/auth/signin/${provider}`;
    form.method = 'POST';
    form.style.display = 'none';

    const csrfInput = document.createElement('input');
    csrfInput.name = 'csrfToken';
    csrfInput.value = csrfToken;

    const callbackUrlInput = document.createElement('input');
    callbackUrlInput.name = 'callbackUrl';
    callbackUrlInput.value = window.location.href;

    form.appendChild(csrfInput);
    form.appendChild(callbackUrlInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const signOut = async () => {
    const { csrfToken } = await $fetch<{ csrfToken: string }>('/api/auth/csrf');
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    await $fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken,
        callbackUrl: window.location.origin,
      }),
    });

    session.value = null;
    status.value = 'unauthenticated';
  };

  return {
    session,
    status,
    isAuthenticated,
    fetchSession,
    signIn,
    signOut,
  };
};
