import type { PostgrestError } from '@supabase/supabase-js'

import type { ParceiroFormModel } from '@/types/partnerForm'

export class ApiError extends Error {
  codigo?: string

  constructor(message: string, codigo?: string) {
    super(message)
    this.name = 'ApiError'
    this.codigo = codigo
  }
}

type CampoParceiro = keyof ParceiroFormModel

const MENSAGENS_CONSTRAINT: Record<string, { campo: CampoParceiro; mensagem: string }> = {
  parceiro_razao_social_nao_vazia: {
    campo: 'razao_social',
    mensagem: 'Informe a razão social.',
  },
  parceiro_nome_fantasia_nao_vazio: {
    campo: 'nome_fantasia',
    mensagem: 'Informe o nome fantasia.',
  },
  parceiro_cnpj_formato: {
    campo: 'cnpj',
    mensagem: 'CNPJ deve ter 14 dígitos.',
  },
  parceiro_cnpj_unico: {
    campo: 'cnpj',
    mensagem: 'Já existe um parceiro cadastrado com este CNPJ.',
  },
  parceiro_telefone_formato: {
    campo: 'telefone',
    mensagem: 'Telefone deve ter 10 ou 11 dígitos.',
  },
  parceiro_email_formato: {
    campo: 'email',
    mensagem: 'E-mail inválido.',
  },
  parceiro_limite_credito_nao_negativo: {
    campo: 'limite_credito',
    mensagem: 'O limite não pode ser negativo.',
  },
  parceiro_cep_formato: {
    campo: 'cep',
    mensagem: 'CEP deve ter 8 dígitos.',
  },
  parceiro_bairro_nao_vazio: {
    campo: 'bairro',
    mensagem: 'Informe o bairro.',
  },
  parceiro_logradouro_nao_vazio: {
    campo: 'logradouro',
    mensagem: 'Informe o logradouro.',
  },
  parceiro_numero_nao_vazio: {
    campo: 'numero',
    mensagem: 'Informe o número.',
  },
}

function extrairNomeConstraint(mensagem: string): string | undefined {
  const entreAspas = mensagem.match(/constraint "([^"]+)"/i)
  if (entreAspas?.[1]) return entreAspas[1]

  for (const nome of Object.keys(MENSAGENS_CONSTRAINT)) {
    if (mensagem.toLowerCase().includes(nome)) return nome
  }

  return undefined
}

function mensagemPorConstraint(nome: string | undefined): string | undefined {
  if (!nome) return undefined
  return MENSAGENS_CONSTRAINT[nome]?.mensagem
}

export function camposErroParceiroFromMessage(
  message: string,
): Partial<Record<CampoParceiro, string>> {
  const nome = extrairNomeConstraint(message)
  const mapeado = nome ? MENSAGENS_CONSTRAINT[nome] : undefined
  if (!mapeado) return {}

  return { [mapeado.campo]: mapeado.mensagem }
}

export function camposErroParceiroSupabase(
  erro: PostgrestError,
): Partial<Record<CampoParceiro, string>> {
  return camposErroParceiroFromMessage(erro.message)
}

export function camposErroParceiroApi(erro: ApiError): Partial<Record<CampoParceiro, string>> {
  if (erro.codigo !== '23505' && erro.codigo !== '23514') return {}
  return camposErroParceiroFromMessage(erro.message)
}

export function mensagemErroSupabase(erro: PostgrestError): string {
  if (erro.code === 'PGRST301' || erro.message.includes('JWT')) {
    return 'Sessão expirada ou inválida. Faça login novamente.'
  }
  if (erro.code === '42501') {
    return 'Sem permissão para acessar estes dados.'
  }
  if (erro.code === 'PGRST116') {
    return 'Parceiro não encontrado.'
  }
  if (erro.code === '23505') {
    const porConstraint = mensagemPorConstraint(extrairNomeConstraint(erro.message))
    if (porConstraint) return porConstraint
    if (erro.message.includes('parceiro_cnpj_unico')) {
      return MENSAGENS_CONSTRAINT.parceiro_cnpj_unico.mensagem
    }
    return 'Registro duplicado. Verifique os dados informados.'
  }
  if (erro.code === '23514') {
    const porConstraint = mensagemPorConstraint(extrairNomeConstraint(erro.message))
    if (porConstraint) return porConstraint
    return 'Algum valor não atende às regras do banco de dados. Revise os campos.'
  }
  return erro.message || 'Não foi possível concluir a operação.'
}

/** Unique violation de CNPJ (Postgres 23505 ou mensagem do PostgREST). */
export function isErroCnpjDuplicado(erro: ApiError): boolean {
  if (erro.codigo === '23505') {
    const texto = erro.message.toLowerCase()
    return (
      texto.includes('cnpj') ||
      texto.includes('parceiro_cnpj_unico') ||
      texto.includes('já existe um parceiro')
    )
  }

  const texto = erro.message.toLowerCase()
  return (
    texto.includes('parceiro_cnpj_unico') ||
    texto.includes('já existe um parceiro') ||
    (texto.includes('duplicate key') && texto.includes('cnpj'))
  )
}
