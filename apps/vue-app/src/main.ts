import { createApp } from 'vue';

import { intlPromise } from './i18n';

import './assets/index.css';

Promise.all([import('./App'), intlPromise])
  .then(([app, intl]) => createApp(app.default).use(intl).mount('#app'))
  .catch(() => {
    console.error('load app error.');
  });
