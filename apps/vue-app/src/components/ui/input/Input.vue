<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue';

import { useVModel } from '@vueuse/core';
import { useForwardPropsEmits } from 'radix-vue';
import { filter } from 'rxjs';
import { computed, ref } from 'vue';

import { useObservableWatch } from '@/hooks';
import { cn } from '@/lib/utils';

const props = defineProps<
  {
    defaultValue?: string | number;
    modelValue?: string | number;
  } & /* @vue-ignore */ InputHTMLAttributes
>();

const emits = defineEmits<(e: 'update:modelValue', payload: string | number) => void>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const elRef = ref<HTMLInputElement>();
const el$ = useObservableWatch(elRef);

defineExpose({
  el$: el$.pipe(filter((v) => !!v)),
});
</script>

<template>
  <input
    ref="elRef"
    v-bind="forwarded"
    v-model="modelValue"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
