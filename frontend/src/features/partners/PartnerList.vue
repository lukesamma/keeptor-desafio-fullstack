<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { usePartnersList } from '@/composables/usePartnersList'
import {
  AppButton,
  AppDataTable,
  type AppTableColumn,
} from '@/design-system'
import { formatarAtivo, formatarMoedaBrl } from '@/utils/format'

const { linhas, carregando, erro, recarregar } = usePartnersList()

const colunas: AppTableColumn[] = [
  { field: 'razao_social', header: 'Razão social' },
  { field: 'nome_fantasia', header: 'Nome fantasia' },
  { field: 'cnpj', header: 'CNPJ' },
  { field: 'localidade', header: 'Cidade / UF' },
  { field: 'limite_credito', header: 'Limite de crédito' },
  { field: 'ativo', header: 'Ativo' },
  { field: 'id', header: '' },
]

const linhasTabela = computed(() =>
  linhas.value.map((row) => ({ ...row })) as Record<string, unknown>[],
)

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900">
          Parceiros
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Cadastre, liste e edite empresas parceiras.
        </p>
      </div>

      <RouterLink :to="{ name: 'parceiros-novo' }">
        <AppButton label="Novo parceiro" />
      </RouterLink>
    </div>

    <div
      v-if="erro"
      role="alert"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <p>{{ erro }}</p>
      <AppButton
        class="mt-3"
        variant="secondary"
        label="Tentar novamente"
        @click="recarregar"
      />
    </div>

    <template v-else>
      <AppDataTable
        v-if="carregando || linhas.length > 0"
        :value="linhasTabela"
        :columns="colunas"
        :loading="carregando"
        empty-message="Nenhum parceiro cadastrado."
      >
        <template #cell-limite_credito="{ value }">
          {{ formatarMoedaBrl(Number(value)) }}
        </template>

        <template #cell-ativo="{ value }">
          <span
            class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
            :class="
              value
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            "
          >
            {{ formatarAtivo(Boolean(value)) }}
          </span>
        </template>

        <template #cell-id="{ row }">
          <RouterLink
            :to="{ name: 'parceiros-editar', params: { id: String(row.id) } }"
            class="text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
          >
            Editar
          </RouterLink>
        </template>
      </AppDataTable>

      <div
        v-else
        class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center"
      >
        <p class="text-sm text-slate-600">
          Comece cadastrando o primeiro parceiro.
        </p>
        <RouterLink :to="{ name: 'parceiros-novo' }">
          <AppButton label="Cadastrar parceiro" />
        </RouterLink>
      </div>
    </template>
  </div>
</template>
