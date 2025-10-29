<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';
import { cn } from '~/lib/utils';
import { useFormField } from './useFormField';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();
const { name, formMessageId } = useFormField();
</script>

<template>
  <ErrorMessage
    v-slot="{ message }"
    :id="formMessageId"
    data-slot="form-message"
    as="p"
    :name="toValue(name)"
    :class="cn('text-destructive text-sm', props.class)"
  >
    <p v-if="message && message.startsWith('#') && message.endsWith('#')" class="truncate">
      {{ t(message.slice(1, message.length - 1)) }}
    </p>
    <p v-else-if="message" class="truncate">{{ message }}</p>
  </ErrorMessage>
</template>
