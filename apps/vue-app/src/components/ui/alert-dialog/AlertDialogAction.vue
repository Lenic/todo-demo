<script setup lang="ts">
import type { AlertDialogActionProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';

import { AlertDialogAction, useForwardPropsEmits } from 'radix-vue';
import { computed } from 'vue';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>();

const emits = defineEmits<(e: 'click', payload: Event) => void>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <AlertDialogAction v-bind="forwarded" :class="cn(buttonVariants(), props.class)">
    <slot />
  </AlertDialogAction>
</template>
