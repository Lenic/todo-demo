import { registerClientServices } from '~/services/register-client';
import { registerServerServices } from '~/services/register-server';

export default defineEventHandler(() => {
  registerServerServices();
  registerClientServices();
});
