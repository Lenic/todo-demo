'use server';

import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/require-await -- this is the page component, must be async component.
export default async function App() {
  return redirect('/todo');
}
