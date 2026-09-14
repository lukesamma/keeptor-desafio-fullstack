import type { PostgrestError } from '@supabase/supabase-js'

export class ApiError extends Error {
  codigo?: string

  constructor(message: string, codigo?: string) {
    super(message)
    this.name = 'ApiError'
    this.codigo = codigo
  }
}

export function mensagemErroSupabase(erro: PostgrestError): string {
  if (erro.code === 'PGRST301' || erro.message.includes('JWT')) {
    return 'Sessão expirada ou inválida. Faça login novamente.'
  }
  if (erro.code === '42501') {
    return 'Sem permissão para acessar estes dados.'
  }
  if (erro.code === '23505' || erro.message.includes('parceiro_cnpj_unico')) {
    return 'Já existe um parceiro cadastrado com este CNPJ.'
  }
  if (erro.code === '23514') {
    return 'Algum valor não atende às regras do banco de dados. Revise os campos.'
  }
  return erro.message || 'Não foi possível concluir a operação.'
}

/** Unique violation de CNPJ (Postgres 23505 ou mensagem do PostgREST). */
export function isErroCnpjDuplicado(erro: ApiError): boolean {
  if (erro.codigo === '23505') return true

  const texto = erro.message.toLowerCase()
  return (
    texto.includes('parceiro_cnpj_unico') ||
    texto.includes('já existe um parceiro') ||
    (texto.includes('duplicate key') && texto.includes('cnpj'))
  )
}
