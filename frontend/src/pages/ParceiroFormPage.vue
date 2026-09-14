<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PartnerForm from '@/features/partners/PartnerForm.vue'

const route = useRoute()
const router = useRouter()

const modo = computed(() =>
  route.name === 'parceiros-editar' ? 'edit' : 'create',
)

const parceiroId = computed(() => {
  if (modo.value !== 'edit') return undefined
  const id = route.params.id
  return typeof id === 'string' ? id : undefined
})

function aoSalvar() {
  void router.push({ name: 'parceiros' })
}
</script>

<template>
  <PartnerForm
    :mode="modo"
    :parceiro-id="parceiroId"
    @success="aoSalvar"
  />
</template>
