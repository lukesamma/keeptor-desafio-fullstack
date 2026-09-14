<script setup lang="ts">
import { onMounted, reactive, ref, toRef } from 'vue'
import { RouterLink } from 'vue-router'

import { useUfMunicipio } from '@/composables/useUfMunicipio'
import {
  AppButton,
  AppCurrencyInput,
  AppDatePicker,
  AppInput,
  AppMaskedInput,
  AppSelect,
  MASK_CEP,
  MASK_CNPJ,
  MASK_TELEFONE,
  useAppToast,
} from '@/design-system'
import { ApiError, isErroCnpjDuplicado } from '@/services/apiError'
import { criarParceiro } from '@/services/partnersService'
import {
  criarParceiroFormVazio,
  parceiroFormParaInsert,
} from '@/types/partnerForm'
import {
  type ErrosParceiroForm,
  validarParceiroForm,
} from '@/utils/partnerValidation'

const emit = defineEmits<{
  success: []
}>()

const toast = useAppToast()
const form = reactive(criarParceiroFormVazio())
const erros = ref<ErrosParceiroForm>({})
const enviando = ref(false)
const erroGeral = ref('')

const ufId = toRef(form, 'uf_id')
const municipioId = toRef(form, 'municipio_id')

const { ufs, municipios, carregandoUfs, carregandoMunicipios, erroGeo, carregarUfs } =
  useUfMunicipio(ufId, municipioId)

onMounted(() => {
  void carregarUfs()
})

function limparErro(campo: keyof ErrosParceiroForm) {
  if (!(campo in erros.value)) return
  const copia = { ...erros.value }
  delete copia[campo]
  erros.value = copia
}

async function salvar() {
  if (enviando.value) return

  erroGeral.value = ''
  erros.value = validarParceiroForm(form)

  if (Object.keys(erros.value).length > 0) {
    toast.warn('Revise os campos', 'Há informações inválidas ou faltando.')
    return
  }

  enviando.value = true

  try {
    const payload = parceiroFormParaInsert(form)
    await criarParceiro(payload)
    toast.success('Parceiro cadastrado', 'O registro foi salvo com sucesso.')
    emit('success')
  } catch (e) {
    if (e instanceof ApiError && isErroCnpjDuplicado(e)) {
      erros.value = { ...erros.value, cnpj: e.message }
      toast.error('CNPJ já cadastrado', e.message)
    } else {
      erroGeral.value =
        e instanceof Error ? e.message : 'Não foi possível salvar o parceiro.'
      toast.error('Falha ao salvar', erroGeral.value)
    }
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900">
          Novo parceiro
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Preencha os dados cadastrais e de endereço.
        </p>
      </div>
      <RouterLink :to="{ name: 'parceiros' }">
        <AppButton
          variant="secondary"
          label="Cancelar"
          :disabled="enviando"
        />
      </RouterLink>
    </div>

    <p
      v-if="erroGeral"
      role="alert"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {{ erroGeral }}
    </p>

    <p
      v-if="erroGeo"
      role="alert"
      class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      {{ erroGeo }}
    </p>

    <form
      class="space-y-8"
      novalidate
      @submit.prevent="salvar"
    >

      <section class="space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Dados da empresa
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <AppInput
            v-model="form.razao_social"
            label="Razão social"
            name="razao_social"
            required
            :disabled="enviando"
            :error="erros.razao_social"
            @update:model-value="limparErro('razao_social')"
          />
          <AppInput
            v-model="form.nome_fantasia"
            label="Nome fantasia"
            name="nome_fantasia"
            required
            :disabled="enviando"
            :error="erros.nome_fantasia"
            @update:model-value="limparErro('nome_fantasia')"
          />
          <AppMaskedInput
            v-model="form.cnpj"
            label="CNPJ"
            name="cnpj"
            :mask="MASK_CNPJ"
            required
            :disabled="enviando"
            :error="erros.cnpj"
            @update:model-value="limparErro('cnpj')"
          />
          <AppInput
            v-model="form.inscricao_estadual"
            label="Inscrição estadual"
            name="inscricao_estadual"
            hint="Opcional"
            :disabled="enviando"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Contato
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <AppMaskedInput
            v-model="form.telefone"
            label="Telefone"
            name="telefone"
            :mask="MASK_TELEFONE"
            required
            :disabled="enviando"
            :error="erros.telefone"
            @update:model-value="limparErro('telefone')"
          />
          <AppInput
            v-model="form.email"
            label="E-mail"
            name="email"
            type="email"
            autocomplete="email"
            required
            :disabled="enviando"
            :error="erros.email"
            @update:model-value="limparErro('email')"
          />
          <AppDatePicker
            v-model="form.data_inicio_relacionamento"
            label="Data de início do relacionamento"
            name="data_inicio_relacionamento"
            required
            :disabled="enviando"
            :error="erros.data_inicio_relacionamento"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Limite de crédito
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <AppCurrencyInput
            v-model="form.limite_credito"
            label="Valor em reais"
            name="limite_credito"
            required
            :disabled="enviando"
            :error="erros.limite_credito"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Endereço
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <AppMaskedInput
            v-model="form.cep"
            label="CEP"
            name="cep"
            :mask="MASK_CEP"
            required
            :disabled="enviando"
            :error="erros.cep"
            @update:model-value="limparErro('cep')"
          />
          <AppSelect
            v-model="form.uf_id"
            label="UF"
            name="uf_id"
            :options="ufs"
            option-label="label"
            option-value="id"
            placeholder="Selecione a UF"
            required
            :loading="carregandoUfs"
            :disabled="enviando"
            :error="erros.uf_id"
            filter
          />
          <AppSelect
            v-model="form.municipio_id"
            label="Município"
            name="municipio_id"
            :options="municipios"
            option-label="nome"
            option-value="id"
            placeholder="Selecione o município"
            required
            :loading="carregandoMunicipios"
            :disabled="enviando || !form.uf_id"
            :error="erros.municipio_id"
            filter
          />
          <AppInput
            v-model="form.bairro"
            label="Bairro"
            name="bairro"
            required
            :disabled="enviando"
            :error="erros.bairro"
            @update:model-value="limparErro('bairro')"
          />
          <AppInput
            v-model="form.logradouro"
            label="Logradouro"
            name="logradouro"
            required
            :disabled="enviando"
            :error="erros.logradouro"
            @update:model-value="limparErro('logradouro')"
          />
          <AppInput
            v-model="form.numero"
            label="Número"
            name="numero"
            required
            :disabled="enviando"
            :error="erros.numero"
            hint="Use S/N se não houver número"
            @update:model-value="limparErro('numero')"
          />
          <AppInput
            v-model="form.complemento"
            label="Complemento"
            name="complemento"
            hint="Opcional"
            :disabled="enviando"
          />
        </div>
      </section>

      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <RouterLink :to="{ name: 'parceiros' }">
          <AppButton
            variant="secondary"
            label="Cancelar"
            :disabled="enviando"
          />
        </RouterLink>
        <AppButton
          type="submit"
          label="Salvar parceiro"
          :loading="enviando"
          :disabled="enviando"
        />
      </div>
    </form>
  </div>
</template>
