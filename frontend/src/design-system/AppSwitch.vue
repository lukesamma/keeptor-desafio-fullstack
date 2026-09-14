<script setup lang="ts">
import ToggleSwitch from 'primevue/toggleswitch'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

withDefaults(
  defineProps<
    AppFieldProps & {
      modelValue?: boolean
    }
  >(),
  {
    modelValue: false,
    disabled: false,
    loading: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
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
    <div class="flex items-center gap-2">
      <ToggleSwitch
        :input-id="inputId"
        :name="name"
        :model-value="modelValue"
        :disabled="disabled || loading"
        :invalid="invalid"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <span
        v-if="!label"
        class="text-sm text-slate-700"
      >
        {{ modelValue ? 'Sim' : 'Não' }}
      </span>
    </div>
  </AppFieldLayout>
</template>
