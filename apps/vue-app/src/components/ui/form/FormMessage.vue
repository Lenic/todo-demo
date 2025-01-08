<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFormField } from './useFormField';

const { t } = useI18n();
const { name, formMessageId } = useFormField();
</script>

<template>
  <ErrorMessage
    v-slot="{ message }"
    :id="formMessageId"
    as="p"
    :name="toValue(name)"
    class="text-sm font-medium text-destructive"
  >
    <p v-if="message && message.startsWith('#') && message.endsWith('#')">
      {{ t(message.slice(1, message.length - 1)) }}
    </p>
    <p v-else-if="message">{{ message }}</p>
  </ErrorMessage>
</template>
