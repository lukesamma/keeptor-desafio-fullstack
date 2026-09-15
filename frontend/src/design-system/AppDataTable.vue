<script setup lang="ts">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

export interface AppTableColumn {
  field: string
  header: string
}

withDefaults(
  defineProps<{
    value: Record<string, unknown>[]
    columns: AppTableColumn[]
    loading?: boolean
    emptyMessage?: string
    dataKey?: string
    /** Nome acessível da tabela (leitores de tela). */
    ariaLabel?: string
  }>(),
  {
    value: () => [],
    columns: () => [],
    loading: false,
    emptyMessage: 'Nenhum registro encontrado.',
    dataKey: 'id',
    ariaLabel: 'Tabela de dados',
  },
)
</script>

<template>
  <div
    class="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white"
    tabindex="-1"
  >
    <DataTable
      :value="value"
      :loading="loading"
      :data-key="dataKey"
      striped-rows
      class="min-w-[44rem] w-full text-sm"
      :aria-label="ariaLabel"
    >
      <template #empty>
        <div class="py-8 text-center text-slate-500">
          {{ emptyMessage }}
        </div>
      </template>

      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      >
        <template #body="{ data }">
          <slot
            :name="`cell-${col.field}`"
            :row="data"
            :value="data[col.field]"
          >
            {{ data[col.field] }}
          </slot>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
