<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

withDefaults(
  defineProps<
    AppFieldProps & {
      modelValue?: number | null
      placeholder?: string
      min?: number
    }
  >(),
  {
    modelValue: 0,
    min: 0,
    disabled: false,
    loading: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()
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
    <InputNumber
      :input-id="inputId"
      :name="name"
      :model-value="modelValue"
      mode="currency"
      currency="BRL"
      locale="pt-BR"
      :min="min"
      :disabled="disabled || loading"
      :invalid="invalid"
      :placeholder="placeholder"
      fluid
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </AppFieldLayout>
</template>
