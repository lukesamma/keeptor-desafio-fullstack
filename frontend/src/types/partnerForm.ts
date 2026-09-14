import type { ParceiroEdicao } from '@/types/partner'
import { formatarDataIso, parseDataIso } from '@/utils/date'
import { apenasDigitos } from '@/utils/digits'

export interface ParceiroFormModel {
  razao_social: string
  nome_fantasia: string
  cnpj: string
  inscricao_estadual: string
  telefone: string
  email: string
  data_inicio_relacionamento: Date | null
  limite_credito: number | null
  ativo: boolean
  uf_id: number | null
  municipio_id: number | null
  cep: string
  bairro: string
  logradouro: string
  numero: string
  complemento: string
}

export type ParceiroUpdatePayload = ParceiroInsertPayload

export interface ParceiroInsertPayload {
  razao_social: string
  nome_fantasia: string
  cnpj: string
  inscricao_estadual: string | null
  telefone: string
  email: string
  data_inicio_relacionamento: string
  limite_credito: number
  ativo: boolean
  municipio_id: number
  cep: string
  bairro: string
  logradouro: string
  numero: string
  complemento: string | null
}

function parceiroFormParaPayload(
  form: ParceiroFormModel,
  ativo: boolean,
): ParceiroInsertPayload {
  if (!form.data_inicio_relacionamento || !form.municipio_id) {
    throw new Error('Formulário incompleto para envio.')
  }

  const inscricao = form.inscricao_estadual.trim()
  const complemento = form.complemento.trim()

  return {
    razao_social: form.razao_social.trim(),
    nome_fantasia: form.nome_fantasia.trim(),
    cnpj: apenasDigitos(form.cnpj),
    inscricao_estadual: inscricao ? inscricao : null,
    telefone: apenasDigitos(form.telefone),
    email: form.email.trim(),
    data_inicio_relacionamento: formatarDataIso(form.data_inicio_relacionamento),
    limite_credito: form.limite_credito ?? 0,
    ativo,
    municipio_id: form.municipio_id,
    cep: apenasDigitos(form.cep),
    bairro: form.bairro.trim(),
    logradouro: form.logradouro.trim(),
    numero: form.numero.trim(),
    complemento: complemento ? complemento : null,
  }
}

/** Cadastro: sempre ativo. */
export function parceiroFormParaInsert(form: ParceiroFormModel): ParceiroInsertPayload {
  return parceiroFormParaPayload(form, true)
}

export function parceiroFormParaUpdate(form: ParceiroFormModel): ParceiroUpdatePayload {
  return parceiroFormParaPayload(form, form.ativo)
}

export function parceiroRegistroParaForm(registro: ParceiroEdicao): ParceiroFormModel {
  const ufId = registro.municipio?.uf_id ?? null

  return {
    razao_social: registro.razao_social,
    nome_fantasia: registro.nome_fantasia,
    cnpj: registro.cnpj.trim(),
    inscricao_estadual: registro.inscricao_estadual ?? '',
    telefone: registro.telefone,
    email: registro.email,
    data_inicio_relacionamento: parseDataIso(registro.data_inicio_relacionamento),
    limite_credito: Number(registro.limite_credito),
    ativo: registro.ativo,
    uf_id: ufId,
    municipio_id: registro.municipio_id,
    cep: registro.cep.trim(),
    bairro: registro.bairro,
    logradouro: registro.logradouro,
    numero: registro.numero,
    complemento: registro.complemento ?? '',
  }
}

export function criarParceiroFormVazio(): ParceiroFormModel {
  return {
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    telefone: '',
    email: '',
    data_inicio_relacionamento: null,
    limite_credito: 0,
    ativo: true,
    uf_id: null,
    municipio_id: null,
    cep: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
  }
}
