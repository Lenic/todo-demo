<script setup lang="ts">
import type { ButtonVariants } from '.';
import type { PrimitiveProps } from 'radix-vue';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'vue';

import { Primitive } from 'radix-vue';

import { cn } from '@/lib/utils';

import { buttonVariants } from '.';

interface Props extends PrimitiveProps, /* @vue-ignore */ ButtonHTMLAttributes {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </Primitive>
</template>
