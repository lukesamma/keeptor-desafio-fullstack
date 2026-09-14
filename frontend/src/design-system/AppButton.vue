<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

import type { AppButtonVariant } from './fieldTypes'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: AppButtonVariant
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    icon?: string
    fluid?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    loading: false,
    disabled: false,
    fluid: false,
  },
)

const severity = computed(() => {
  if (props.variant === 'danger') return 'danger'
  if (props.variant === 'secondary') return 'secondary'
  return undefined
})

const outlined = computed(() => props.variant === 'secondary')
</script>

<template>
  <Button
    :type="type"
    :label="label"
    :icon="icon"
    :severity="severity"
    :outlined="outlined"
    :loading="loading"
    :disabled="disabled"
    :fluid="fluid"
  >
    <slot />
  </Button>
</template>
