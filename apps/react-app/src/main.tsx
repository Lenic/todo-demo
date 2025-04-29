import '@todo/controllers';

import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { intl } from './i18n';

import './index.css';

const App = lazy(() => Promise.all([import('./App'), intl]).then(([App]) => App));

const el = document.getElementById('root');
if (el) {
  createRoot(el).render(
    <Suspense fallback={<div>Loading</div>}>
      <App />
    </Suspense>,
  );
}
