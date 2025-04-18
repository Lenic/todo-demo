import '@todo/controllers';

import { lazy, Suspense } from 'solid-js';
import { render } from 'solid-js/web';

import { i18n } from './i18n';

import './index.css';

const root = document.getElementById('root');
if (root) {
  const App = lazy(() => Promise.all([import('./App'), i18n.ready]).then(([App]) => App));
  render(
    () => (
      <Suspense fallback={<div>Loading</div>}>
        <App />
      </Suspense>
    ),
    root,
  );
}
