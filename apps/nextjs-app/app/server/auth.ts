'use server';

import { signOut } from '@/auth';

export async function signOutSystem() {
  await signOut();
}
