<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import PartnerForm from '@/features/partners/PartnerForm.vue'
import { AppButton } from '@/design-system'

const route = useRoute()
const router = useRouter()

const isEdicao = computed(() => route.name === 'parceiros-editar')

function aoSalvar() {
  void router.push({ name: 'parceiros' })
}
</script>

<template>
  <PartnerForm
    v-if="!isEdicao"
    @success="aoSalvar"
  />

  <div
    v-else
    class="space-y-4"
  >
    <h1 class="text-xl font-semibold tracking-tight text-slate-900">
      Editar parceiro
    </h1>
    <p class="text-sm text-slate-500">
      A edição será implementada na fase 8 do plano.
    </p>
    <RouterLink :to="{ name: 'parceiros' }">
      <AppButton
        variant="secondary"
        label="Voltar para listagem"
      />
    </RouterLink>
  </div>
</template>
