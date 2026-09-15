import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AppButton from '../AppButton.vue'
import { parametrosDesignSystem } from './storyMeta'

const meta = {
  title: 'Design System/AppButton',
  component: AppButton,
  tags: ['autodocs'],
  parameters: parametrosDesignSystem,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof AppButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primario: Story = {
  args: { label: 'Salvar parceiro' },
}

export const Secundario: Story = {
  args: { label: 'Cancelar', variant: 'secondary' },
}

export const Perigo: Story = {
  args: { label: 'Excluir', variant: 'danger' },
}

export const Carregando: Story = {
  args: { label: 'Salvando…', loading: true },
}
