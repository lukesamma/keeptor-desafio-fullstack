import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import AppCurrencyInput from '../AppCurrencyInput.vue'
import AppDatePicker from '../AppDatePicker.vue'
import AppMaskedInput from '../AppMaskedInput.vue'
import AppSelect from '../AppSelect.vue'
import AppSwitch from '../AppSwitch.vue'
import { MASK_CEP, MASK_CNPJ, MASK_TELEFONE } from '../masks'
import { parametrosDesignSystem } from './storyMeta'

const ufs = [
  { id: 35, label: 'SP — São Paulo' },
  { id: 33, label: 'RJ — Rio de Janeiro' },
]

const meta = {
  title: 'Design System/Campos do formulário',
  tags: ['autodocs'],
  parameters: parametrosDesignSystem,
} satisfies Meta

export default meta
type Story = StoryObj

export const Cnpj: Story = {
  render: () => ({
    components: { AppMaskedInput },
    setup() {
      const valor = ref('11.222.333/0001-81')
      return { valor, MASK_CNPJ }
    },
    template:
      '<AppMaskedInput v-model="valor" label="CNPJ" name="cnpj" :mask="MASK_CNPJ" required />',
  }),
}

export const Telefone: Story = {
  render: () => ({
    components: { AppMaskedInput },
    setup() {
      const valor = ref('(11) 98765-4321')
      return { valor, MASK_TELEFONE }
    },
    template:
      '<AppMaskedInput v-model="valor" label="Telefone" name="telefone" :mask="MASK_TELEFONE" required />',
  }),
}

export const Cep: Story = {
  render: () => ({
    components: { AppMaskedInput },
    setup() {
      const valor = ref('01310-100')
      return { valor, MASK_CEP }
    },
    template:
      '<AppMaskedInput v-model="valor" label="CEP" name="cep" :mask="MASK_CEP" required />',
  }),
}

export const Moeda: Story = {
  render: () => ({
    components: { AppCurrencyInput },
    setup() {
      const valor = ref(1500.5)
      return { valor }
    },
    template:
      '<AppCurrencyInput v-model="valor" label="Limite de crédito" name="limite_credito" required />',
  }),
}

export const Data: Story = {
  render: () => ({
    components: { AppDatePicker },
    setup() {
      const valor = ref(new Date(2024, 5, 1))
      return { valor }
    },
    template:
      '<AppDatePicker v-model="valor" label="Data de início" name="data_inicio_relacionamento" required />',
  }),
}

export const Uf: Story = {
  render: () => ({
    components: { AppSelect },
    setup() {
      const valor = ref(35)
      return { valor, ufs }
    },
    template: `<AppSelect
      v-model="valor"
      label="UF"
      name="uf_id"
      :options="ufs"
      option-label="label"
      option-value="id"
      placeholder="Selecione a UF"
      filter
      required
    />`,
  }),
}

export const Ativo: Story = {
  render: () => ({
    components: { AppSwitch },
    setup() {
      const valor = ref(true)
      return { valor }
    },
    template:
      '<AppSwitch v-model="valor" label="Parceiro ativo" name="ativo" hint="Desative para manter o histórico." />',
  }),
}
