<script setup lang="ts">
import Select from 'primevue/select'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

withDefaults(
  defineProps<
    AppFieldProps & {
      modelValue?: string | number | boolean | null
      options: Record<string, unknown>[]
      optionLabel?: string
      optionValue?: string
      placeholder?: string
      filter?: boolean
    }
  >(),
  {
    modelValue: null,
    options: () => [],
    optionLabel: 'label',
    disabled: false,
    loading: false,
    required: false,
    filter: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | null]
  blur: []
}>()
</script>

<template>
  <AppFieldLayout
    :label="label"
    :name="name"
    :id="id"
    :error="error"
    :hint="loading ? 'Carregando opções…' : hint"
    :required="required"
    v-slot="{ inputId, describedBy, invalid }"
  >
    <Select
      :input-id="inputId"
      :name="name"
      :model-value="modelValue"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      :invalid="invalid"
      :filter="filter"
      fluid
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      @update:model-value="emit('update:modelValue', $event)"
      @blur="emit('blur')"
    />
  </AppFieldLayout>
</template>
