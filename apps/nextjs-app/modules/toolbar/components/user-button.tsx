import { signOutSystem } from '@/app/server/auth';
import { auth } from '@/auth';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getIntl } from '@/i18n';

export async function UserButton() {
  const session = await auth();
  if (!session?.user) return null;

  const { t } = await getIntl('settings.user');
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative overflow-hidden size-9 rounded-md shadow-xs border">
            <Avatar className="size-9 rounded-none">
              <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <form action={signOutSystem} className="w-full">
              <Button variant="ghost" className="w-full p-0">
                {t('sign-out')}
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
