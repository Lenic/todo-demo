import { Loader2 } from 'lucide-vue-next';

import { useIntl } from '@/i18n';
import { useAuth } from '~/hooks';
import { Avatar, AvatarImage } from '~/ui/avatar';
import { Button } from '~/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu';

export const UserButton = defineComponent({
  name: 'UserButton',
  setup() {
    const { t } = useIntl('settings.user');
    const { session, signOut } = useAuth();

    const pendingRef = ref(false);
    function handleSignOut(e: SubmitEvent) {
      e.preventDefault();

      if (pendingRef.value) return;

      pendingRef.value = true;
      signOut()
        .then(() => void navigateTo({ path: '/auth/signin' }))
        .finally(() => void (pendingRef.value = false))
        .catch((err: unknown) => {
          console.log('[Sign Out]: sign out fail.', err);
        });
    }

    if (!session.value?.user) return null;
    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="relative overflow-hidden size-9 rounded-md shadow-xs border">
            <Avatar class="size-9 rounded-none">
              <AvatarImage src={session.value?.user?.image ?? ''} alt={session.value?.user?.name ?? ''} />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">{session.value?.user?.name}</p>
              <p class="text-muted-foreground text-xs leading-none">{session.value?.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <form class="w-full" onSubmit={handleSignOut}>
              <Button variant="ghost" class="w-full p-0" disabled={pendingRef.value}>
                {pendingRef.value && <Loader2 class="w-4 h-4 mr-2 animate-spin" />}
                {t('sign-out')}
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
