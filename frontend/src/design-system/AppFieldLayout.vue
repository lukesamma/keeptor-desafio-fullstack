<script setup lang="ts">
import { useFieldIds } from './useFieldIds'
import type { AppFieldProps } from './fieldTypes'

const props = defineProps<AppFieldProps>()

const { inputId, errorId, hintId, describedBy } = useFieldIds(props)

defineExpose({ inputId, errorId, hintId, describedBy })
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-slate-700"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-600"
        aria-hidden="true"
      >
        *
      </span>
    </label>

    <slot
      :input-id="inputId"
      :error-id="errorId"
      :hint-id="hintId"
      :described-by="describedBy"
      :invalid="Boolean(error)"
    />

    <p
      v-if="hint && !error"
      :id="hintId"
      class="text-xs text-slate-500"
    >
      {{ hint }}
    </p>

    <p
      v-if="error"
      :id="errorId"
      role="alert"
      class="text-xs text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
