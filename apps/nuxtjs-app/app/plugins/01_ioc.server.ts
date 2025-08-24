import { registerClientService } from '#shared/services/register-client';
import { registerService } from '#shared/services/register-server';

export default defineNuxtPlugin(async () => {
  registerService();

  registerClientService();
});
