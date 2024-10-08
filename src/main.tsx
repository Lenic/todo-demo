import 'reflect-metadata';

import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { intl } from './i18n';

import './index.css';

// eslint-disable-next-line react-refresh/only-export-components -- this is the entrance
const App = lazy(() => Promise.all([import('./App'), intl]).then(([App]) => App));

const el = document.getElementById('root');
if (el) {
  createRoot(el).render(
    <StrictMode>
      <Suspense fallback={<div>Loading</div>}>
        <App />
      </Suspense>
    </StrictMode>,
  );
}
