import type { ITodoItem } from '@todo/controllers';

import { ServiceLocator } from '@todo/container';
import { ETodoListType, IDataService } from '@todo/controllers';
import { map } from 'rxjs';
import { defineComponent, ref } from 'vue';

import { Button } from '@/components/ui/button';

import { ELocaleType, setLocale, useIntl } from './i18n';

const dataService = ServiceLocator.default.get(IDataService);

export default defineComponent({
  setup() {
    const { t } = useIntl('todo.editor');
    const dataRef = ref<ITodoItem[]>([]);
    dataService
      .loadMore(ETodoListType.PENDING)
      .pipe(map(() => dataService.dataMapper))
      .subscribe((mapper) => {
        dataRef.value = Object.values(mapper);
      });

    const handleLoadArchive = () => {
      dataService
        .loadMore(ETodoListType.ARCHIVE)
        .pipe(map(() => dataService.dataMapper))
        .subscribe((mapper) => {
          dataRef.value = Object.values(mapper);
        });
    };

    return () => (
      <div id="app">
        <h1>Hello Vite + Vue 3</h1>
        <p>{t('title')}</p>
        Button: <Button onClick={handleLoadArchive}>load archive</Button>
        <div>abc</div>
        <Button
          onClick={() => {
            setLocale(ELocaleType.JA_JP);
          }}
        >
          jp
        </Button>
        <Button
          onClick={() => {
            setLocale(ELocaleType.ZH_CN);
          }}
        >
          cn
        </Button>
        <Button
          onClick={() => {
            setLocale(ELocaleType.EN_US);
          }}
        >
          en
        </Button>
        <p>
          <a class="link" href="https://vitejs.dev/guide/features.html" target="_blank">
            Vite Documentation
          </a>
          &nbsp;|&nbsp;
          <a class="link" href="https://v3.vuejs.org/" target="_blank">
            Vue 3 Documentation
          </a>
          <ul>
            {dataRef.value.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </p>
      </div>
    );
  },
});
