<script setup lang="ts">
import type { ScrollAreaRootProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';

import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'radix-vue';
import { filter, map } from 'rxjs';
import { computed, ref } from 'vue';

import { useObservableWatch } from '@/hooks';
import { cn } from '@/lib/utils';

import ScrollBar from './ScrollBar.vue';

const props = defineProps<ScrollAreaRootProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const viewportRef = ref<{ viewportElement: HTMLDivElement }>();
const viewport$ = useObservableWatch(viewportRef);

defineExpose({
  viewportElement$: viewport$.pipe(
    filter((v) => !!v),
    map((v) => v.viewportElement),
  ),
});
</script>

<template>
  <ScrollAreaRoot v-bind="delegatedProps" :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport ref="viewportRef" class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
