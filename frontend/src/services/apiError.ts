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
  return erro.message || 'Não foi possível concluir a operação.'
}
