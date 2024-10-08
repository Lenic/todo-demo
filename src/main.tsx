import 'reflect-metadata';

import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

// eslint-disable-next-line react-refresh/only-export-components -- this is the entrance
const App = lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <App />
    </Suspense>
  </StrictMode>,
);
