<script setup lang="ts">
import InputMask from 'primevue/inputmask'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

withDefaults(
  defineProps<
    AppFieldProps & {
      modelValue?: string | null
      mask: string
      placeholder?: string
      /** Quando true, `modelValue` são só dígitos (padrão para CNPJ/CEP/telefone). */
      unmask?: boolean
    }
  >(),
  {
    modelValue: '',
    unmask: true,
    disabled: false,
    loading: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
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
    :hint="loading ? 'Carregando…' : hint"
    :required="required"
    v-slot="{ inputId, describedBy, invalid }"
  >
    <InputMask
      :id="inputId"
      :name="name"
      :mask="mask"
      :model-value="modelValue ?? ''"
      :unmask="unmask"
      :disabled="disabled || loading"
      :invalid="invalid"
      :placeholder="placeholder"
      fluid
      :aria-describedby="describedBy"
      :aria-invalid="invalid || undefined"
      :aria-required="required || undefined"
      @update:model-value="onUpdate"
      @blur="emit('blur')"
    />
  </AppFieldLayout>
</template>
