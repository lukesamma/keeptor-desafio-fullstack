<script setup lang="ts">
import InputText from 'primevue/inputtext'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

withDefaults(
  defineProps<
    AppFieldProps & {
      modelValue?: string | null
      type?: 'text' | 'email'
      placeholder?: string
      autocomplete?: string
    }
  >(),
  {
    modelValue: '',
    type: 'text',
    disabled: false,
    loading: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onUpdate(value: string | undefined) {
  emit('update:modelValue', value ?? '')
}
</script>

<template>
  <AppFieldLayout
    :label="label"
    :name="name"
    :id="id"
    :error="error"
    :hint="hint"
    :required="required"
    v-slot="{ inputId, describedBy, invalid }"
  >
    <InputText
      :id="inputId"
      :name="name"
      :model-value="modelValue ?? ''"
      :disabled="disabled || loading"
      :invalid="invalid"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      fluid
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      :pt="{ root: { type } }"
      @update:model-value="onUpdate"
    />
  </AppFieldLayout>
</template>
