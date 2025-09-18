import { useAuth } from '~/hooks';

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo(`/auth/signin?callbackUrl=${encodeURIComponent(to.fullPath)}`);
  }
});
