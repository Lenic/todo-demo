import { registerService } from '#shared/services/register-server';
import { registerClientService } from '#shared/services/register-client';

export default defineNuxtRouteMiddleware(() => {
  registerService();

  registerClientService();
});
