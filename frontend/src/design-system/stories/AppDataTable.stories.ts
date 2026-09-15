import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AppDataTable, { type AppTableColumn } from '../AppDataTable.vue'
import { parametrosDesignSystem } from './storyMeta'

const colunas: AppTableColumn[] = [
  { field: 'razao_social', header: 'Razão social' },
  { field: 'cnpj', header: 'CNPJ' },
  { field: 'ativo', header: 'Ativo' },
]

const linhas = [
  { id: '1', razao_social: 'Keeptor LTDA', cnpj: '11222333000181', ativo: 'Sim' },
  { id: '2', razao_social: 'Parceiro Demo', cnpj: '045252011000110', ativo: 'Não' },
]

const meta = {
  title: 'Design System/AppDataTable',
  component: AppDataTable,
  tags: ['autodocs'],
  parameters: parametrosDesignSystem,
  args: {
    value: linhas,
    columns: colunas,
    ariaLabel: 'Lista de parceiros (exemplo)',
  },
} satisfies Meta<typeof AppDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const ComDados: Story = {}

export const Carregando: Story = {
  args: {
    loading: true,
    value: [],
  },
}

export const Vazio: Story = {
  args: {
    value: [],
    emptyMessage: 'Nenhum parceiro cadastrado.',
  },
}
