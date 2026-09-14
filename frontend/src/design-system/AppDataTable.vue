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
  }>(),
  {
    value: () => [],
    columns: () => [],
    loading: false,
    emptyMessage: 'Nenhum registro encontrado.',
    dataKey: 'id',
  },
)
</script>

<template>
  <DataTable
    :value="value"
    :loading="loading"
    :data-key="dataKey"
    striped-rows
    class="text-sm"
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
</template>
