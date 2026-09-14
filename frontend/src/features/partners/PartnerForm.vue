<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRef } from 'vue'
import { RouterLink } from 'vue-router'

import { useUfMunicipio } from '@/composables/useUfMunicipio'
import {
  AppButton,
  AppCurrencyInput,
  AppDatePicker,
  AppInput,
  AppMaskedInput,
  AppSelect,
  AppSwitch,
  MASK_CEP,
  MASK_CNPJ,
  MASK_TELEFONE,
  useAppToast,
} from '@/design-system'
import {
  ApiError,
  camposErroParceiroApi,
  isErroCnpjDuplicado,
} from '@/services/apiError'
import {
  atualizarParceiro,
  buscarParceiroPorId,
  criarParceiro,
} from '@/services/partnersService'
import {
  type ParceiroFormModel,
  criarParceiroFormVazio,
  parceiroFormParaInsert,
  parceiroFormParaUpdate,
  parceiroRegistroParaForm,
} from '@/types/partnerForm'
import {
  type ErrosParceiroForm,
  validarCampoParceiroForm,
  validarParceiroForm,
} from '@/utils/partnerValidation'

const props = defineProps<{
  mode: 'create' | 'edit'
  parceiroId?: string
}>()

const emit = defineEmits<{
  success: []
}>()

const isEdicao = computed(() => props.mode === 'edit')

const toast = useAppToast()
const form = reactive(criarParceiroFormVazio())
const erros = ref<ErrosParceiroForm>({})
const enviando = ref(false)
const carregandoRegistro = ref(false)
const erroGeral = ref('')

const ufId = toRef(form, 'uf_id')
const municipioId = toRef(form, 'municipio_id')

const {
  ufs,
  municipios,
  carregandoUfs,
  carregandoMunicipios,
  erroGeo,
  carregarUfs,
  carregarMunicipios,
} = useUfMunicipio(ufId, municipioId)

async function carregarParaEdicao() {
  if (!props.parceiroId) return

  carregandoRegistro.value = true
  erroGeral.value = ''

  try {
    await carregarUfs()
    const registro = await buscarParceiroPorId(props.parceiroId)
    const dados = parceiroRegistroParaForm(registro)
    const uf = dados.uf_id
    const municipio = dados.municipio_id

    Object.assign(form, { ...dados, uf_id: null, municipio_id: null })

    if (uf) {
      form.uf_id = uf
      await carregarMunicipios(uf)
      form.municipio_id = municipio
    }
  } catch (e) {
    erroGeral.value =
      e instanceof Error ? e.message : 'Não foi possível carregar o parceiro.'
    toast.error('Falha ao carregar', erroGeral.value)
  } finally {
    carregandoRegistro.value = false
  }
}

onMounted(() => {
  if (isEdicao.value) {
    void carregarParaEdicao()
  } else {
    void carregarUfs()
  }
})

function limparErro(campo: keyof ErrosParceiroForm) {
  if (!(campo in erros.value)) return
  const copia = { ...erros.value }
  delete copia[campo]
  erros.value = copia
}

function revalidarCampo(campo: keyof ParceiroFormModel) {
  const mensagem = validarCampoParceiroForm(form, campo)
  if (mensagem) {
    erros.value = { ...erros.value, [campo]: mensagem }
    return
  }
  limparErro(campo)
}

function aoSairCampo(campo: keyof ParceiroFormModel) {
  revalidarCampo(campo)
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
    if (isEdicao.value && props.parceiroId) {
      const payload = parceiroFormParaUpdate(form)
      await atualizarParceiro(props.parceiroId, payload)
      toast.success('Parceiro atualizado', 'As alterações foram salvas.')
    } else {
      const payload = parceiroFormParaInsert(form)
      await criarParceiro(payload)
      toast.success('Parceiro cadastrado', 'O registro foi salvo com sucesso.')
    }
    emit('success')
  } catch (e) {
    if (e instanceof ApiError) {
      const camposApi = camposErroParceiroApi(e)
      if (Object.keys(camposApi).length > 0) {
        erros.value = { ...erros.value, ...camposApi }
        toast.warn('Revise os campos', e.message)
      } else if (isErroCnpjDuplicado(e)) {
        erros.value = { ...erros.value, cnpj: e.message }
        toast.error('CNPJ já cadastrado', e.message)
      } else {
        erroGeral.value =
          e instanceof Error ? e.message : 'Não foi possível salvar o parceiro.'
        toast.error('Falha ao salvar', erroGeral.value)
      }
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
          {{ isEdicao ? 'Editar parceiro' : 'Novo parceiro' }}
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdicao
              ? 'Atualize os dados cadastrais e de endereço.'
              : 'Preencha os dados cadastrais e de endereço.'
          }}
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

    <p
      v-if="carregandoRegistro"
      class="text-sm text-slate-500"
    >
      Carregando dados do parceiro…
    </p>

    <form
      v-else
      class="space-y-8"
      novalidate
      @submit.prevent="salvar"
    >
      <section
        v-if="isEdicao"
        class="space-y-3"
      >
        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Situação do cadastro
        </h2>
        <div
          class="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="space-y-1">
            <p class="text-sm font-medium text-slate-900">
              Parceiro ativo
            </p>
            <p class="text-xs text-slate-500">
              Desative para manter o histórico sem tratar como parceiro em uso.
            </p>
          </div>
          <AppSwitch
            v-model="form.ativo"
            name="ativo"
            :disabled="enviando"
          />
        </div>
      </section>

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
            @blur="aoSairCampo('razao_social')"
          />
          <AppInput
            v-model="form.nome_fantasia"
            label="Nome fantasia"
            name="nome_fantasia"
            required
            :disabled="enviando"
            :error="erros.nome_fantasia"
            @update:model-value="limparErro('nome_fantasia')"
            @blur="aoSairCampo('nome_fantasia')"
          />
          <AppMaskedInput
            v-model="form.cnpj"
            label="CNPJ"
            name="cnpj"
            :mask="MASK_CNPJ"
            required
            :disabled="enviando || carregandoRegistro"
            :error="erros.cnpj"
            @update:model-value="limparErro('cnpj')"
            @blur="aoSairCampo('cnpj')"
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
            @blur="aoSairCampo('telefone')"
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
            @blur="aoSairCampo('email')"
          />
          <AppDatePicker
            v-model="form.data_inicio_relacionamento"
            label="Data de início do relacionamento"
            name="data_inicio_relacionamento"
            required
            :disabled="enviando"
            :error="erros.data_inicio_relacionamento"
            @update:model-value="revalidarCampo('data_inicio_relacionamento')"
            @blur="aoSairCampo('data_inicio_relacionamento')"
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
            @update:model-value="limparErro('limite_credito')"
            @blur="aoSairCampo('limite_credito')"
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
            @blur="aoSairCampo('cep')"
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
            @update:model-value="revalidarCampo('uf_id')"
            @blur="aoSairCampo('uf_id')"
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
            @update:model-value="revalidarCampo('municipio_id')"
            @blur="aoSairCampo('municipio_id')"
          />
          <AppInput
            v-model="form.bairro"
            label="Bairro"
            name="bairro"
            required
            :disabled="enviando"
            :error="erros.bairro"
            @update:model-value="limparErro('bairro')"
            @blur="aoSairCampo('bairro')"
          />
          <AppInput
            v-model="form.logradouro"
            label="Logradouro"
            name="logradouro"
            required
            :disabled="enviando"
            :error="erros.logradouro"
            @update:model-value="limparErro('logradouro')"
            @blur="aoSairCampo('logradouro')"
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
            @blur="aoSairCampo('numero')"
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
          :label="isEdicao ? 'Salvar alterações' : 'Salvar parceiro'"
          :loading="enviando"
          :disabled="enviando"
        />
      </div>
    </form>
  </div>
</template>
