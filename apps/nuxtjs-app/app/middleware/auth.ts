import { useAuth } from '~/hooks';

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo(`/api/auth/signin?callbackUrl=${encodeURIComponent(to.fullPath)}`);
  }
});
