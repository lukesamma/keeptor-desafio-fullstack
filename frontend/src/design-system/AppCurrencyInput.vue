<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import InputText from 'primevue/inputtext'

import AppFieldLayout from './AppFieldLayout.vue'
import type { AppFieldProps } from './fieldTypes'

const props = withDefaults(
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
  blur: []
}>()

/** Dígitos = centavos (ex.: "12345" → R$ 123,45). Evita o InputNumber em currency, que trava edição no fim do campo. */
const centDigits = ref('')

function numberToCentDigits(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return ''
  const cents = Math.round(value * 100)
  return String(cents)
}

function centDigitsToNumber(digits: string): number {
  const clean = digits.replace(/\D/g, '')
  if (!clean) return props.min ?? 0
  return parseInt(clean, 10) / 100
}

function formatCentDigits(digits: string): string {
  const clean = digits.replace(/\D/g, '')
  if (!clean) return ''
  const valor = parseInt(clean, 10) / 100
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function sameAmount(a: number, b: number | null | undefined): boolean {
  return Math.round(a * 100) === Math.round((b ?? 0) * 100)
}

watch(
  () => props.modelValue,
  (value) => {
    const atual = centDigitsToNumber(centDigits.value)
    if (!sameAmount(atual, value)) {
      centDigits.value = numberToCentDigits(value)
    }
  },
  { immediate: true },
)

const textoExibido = computed(() => formatCentDigits(centDigits.value))

function onUpdate(raw: string | undefined) {
  const digits = (raw ?? '').replace(/\D/g, '')
  centDigits.value = digits

  let valor = centDigitsToNumber(digits)
  const min = props.min ?? 0
  if (valor < min) {
    valor = min
    centDigits.value = String(Math.round(valor * 100))
  }

  emit('update:modelValue', valor)
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
      :model-value="textoExibido"
      inputmode="numeric"
      autocomplete="off"
      :disabled="disabled || loading"
      :invalid="invalid"
      :placeholder="placeholder"
      fluid
      :aria-describedby="describedBy"
      :aria-required="required || undefined"
      @update:model-value="onUpdate"
      @blur="emit('blur')"
    />
  </AppFieldLayout>
</template>
