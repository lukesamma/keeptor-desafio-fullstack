<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { AppButton } from '@/design-system'

const route = useRoute()

const titulo = computed(() =>
  route.name === 'parceiros-editar' ? 'Editar parceiro' : 'Novo parceiro',
)
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold tracking-tight text-slate-900">
      {{ titulo }}
    </h1>
    <p class="text-sm text-slate-500">
      O formulário completo será implementado na fase 7 (cadastro) e fase 8 (edição).
    </p>
    <RouterLink :to="{ name: 'parceiros' }">
      <AppButton
        variant="secondary"
        label="Voltar para listagem"
      />
    </RouterLink>
  </div>
</template>
