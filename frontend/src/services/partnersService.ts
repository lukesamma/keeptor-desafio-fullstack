import { supabase } from '@/lib/supabase'
import type { ParceiroListagem } from '@/types/partner'

import { ApiError, mensagemErroSupabase } from './apiError'

const COLUNAS_LISTAGEM = `
  id,
  razao_social,
  nome_fantasia,
  cnpj,
  ativo,
  limite_credito,
  data_inicio_relacionamento,
  municipio (
    nome,
    uf (
      sigla
    )
  )
`

export async function listarParceiros(): Promise<ParceiroListagem[]> {
  const { data, error } = await supabase
    .from('parceiro')
    .select(COLUNAS_LISTAGEM)
    .order('created_at', { ascending: false })

  if (error) {
    throw new ApiError(mensagemErroSupabase(error), error.code)
  }

  return (data ?? []) as unknown as ParceiroListagem[]
}
