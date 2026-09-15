<script setup lang="ts">
import DatePicker from 'primevue/datepicker'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

withDefaults(
  defineProps<
    AppFieldProps & {
      modelValue?: Date | null
      placeholder?: string
    }
  >(),
  {
    modelValue: null,
    disabled: false,
    loading: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  blur: []
}>()

function onDateChange(value: Date | (Date | null)[] | Date[] | null | undefined) {
  if (value instanceof Date) {
    emit('update:modelValue', value)
    return
  }
  if (value == null) {
    emit('update:modelValue', null)
    return
  }
  if (Array.isArray(value)) {
    const first = value[0]
    emit('update:modelValue', first instanceof Date ? first : null)
  }
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
    <DatePicker
      :input-id="inputId"
      :name="name"
      :model-value="modelValue"
      date-format="dd/mm/yy"
      :disabled="disabled || loading"
      :invalid="invalid"
      :placeholder="placeholder"
      show-icon
      icon-display="input"
      fluid
      :aria-describedby="describedBy"
      :aria-invalid="invalid || undefined"
      :aria-required="required || undefined"
      @update:model-value="onDateChange"
      @blur="emit('blur')"
    />
  </AppFieldLayout>
</template>
