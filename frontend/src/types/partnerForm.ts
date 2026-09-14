import { formatarDataIso } from '@/utils/date'
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

export function parceiroFormParaInsert(form: ParceiroFormModel): ParceiroInsertPayload {
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
    // Cadastro: sempre ativo (DEFAULT no banco; edição trata inativação na fase 8).
    ativo: true,
    municipio_id: form.municipio_id,
    cep: apenasDigitos(form.cep),
    bairro: form.bairro.trim(),
    logradouro: form.logradouro.trim(),
    numero: form.numero.trim(),
    complemento: complemento ? complemento : null,
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
