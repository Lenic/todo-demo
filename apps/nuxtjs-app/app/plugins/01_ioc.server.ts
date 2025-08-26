import { registerClientServices } from '~/services/register-client';
import { registerServerServices } from '~/services/register-server';

export default defineNuxtPlugin(() => {
  registerClientServices();
  registerServerServices();
});
