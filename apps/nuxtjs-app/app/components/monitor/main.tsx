import { useI18n } from 'vue-i18n';

import { channelIdSubject, translationFormattingSubject } from './constants';

export const GlobalMonitor = defineComponent({
  name: 'GlobalMonitor',
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    translationFormattingSubject.next(t);

    onMounted(() => {
      channelIdSubject.next(props.channelId);
    });

    return () => null;
  },
});
