import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AppInput from '../AppInput.vue'
import { parametrosDesignSystem } from './storyMeta'

const meta = {
  title: 'Design System/AppInput',
  component: AppInput,
  tags: ['autodocs'],
  parameters: parametrosDesignSystem,
  args: {
    label: 'Razão social',
    name: 'razao_social',
    modelValue: '',
    required: true,
  },
} satisfies Meta<typeof AppInput>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComHint: Story = {
  args: {
    label: 'Inscrição estadual',
    hint: 'Opcional',
    required: false,
  },
}

export const ComErro: Story = {
  args: {
    label: 'E-mail',
    type: 'email',
    modelValue: 'invalido',
    error: 'E-mail inválido.',
  },
}

export const Desabilitado: Story = {
  args: {
    modelValue: 'Keeptor LTDA',
    disabled: true,
  },
}
