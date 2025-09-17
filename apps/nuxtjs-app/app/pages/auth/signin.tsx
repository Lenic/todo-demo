import type { RouteLocationNormalized } from 'vue-router';

import { defineComponent } from 'vue';

import { useAuth } from '~/hooks/auth';
import { cn } from '~/lib/utils';

export default defineComponent({
  name: 'SignIn',
  setup() {
    definePageMeta({
      middleware: [
        function (to: RouteLocationNormalized) {
          const { isAuthenticated } = useAuth();
          if (isAuthenticated.value && to.path === '/auth/signin') {
            return navigateTo('/');
          }
        },
      ],
    });

    const { signIn } = useAuth();
    const handleSignIn = () => void signIn('github');

    return () => (
      <div class="fixed inset-0 bg-muted grid place-content-center">
        <main class="relative w-92 bg-background rounded-2xl px-8 py-4">
          <img loading="lazy" alt="Logo" src="/logo.png" class="my-5 mx-auto max-h-18 max-w-38" />
          <button
            class={cn(
              'px-4 py-3 flex flex-row justify-between w-full rounded-lg border items-center',
              'text-sm text-foreground hover:bg-muted',
              'transition-colors ease-in-out cursor-pointer duration-250',
            )}
            onClick={handleSignIn}
          >
            <span class="">Sign in with GitHub</span>
            <svg
              class="w-6 h-6"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
            </svg>
          </button>
        </main>
      </div>
    );
  },
});
