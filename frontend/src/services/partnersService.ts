import { supabase } from '@/lib/supabase'
import type { ParceiroEdicao, ParceiroListagem } from '@/types/partner'
import type { ParceiroInsertPayload, ParceiroUpdatePayload } from '@/types/partnerForm'

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

const COLUNAS_DETALHE = `
  id,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  telefone,
  email,
  data_inicio_relacionamento,
  limite_credito,
  ativo,
  municipio_id,
  cep,
  bairro,
  logradouro,
  numero,
  complemento,
  created_at,
  updated_at,
  municipio:municipio_id (
    id,
    nome,
    uf_id
  )
`

export async function buscarParceiroPorId(id: string): Promise<ParceiroEdicao> {
  const { data, error } = await supabase
    .from('parceiro')
    .select(COLUNAS_DETALHE)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new ApiError(mensagemErroSupabase(error), error.code)
  }

  if (!data) {
    throw new ApiError('Parceiro não encontrado.', 'PGRST116')
  }

  return data as unknown as ParceiroEdicao
}

export async function criarParceiro(payload: ParceiroInsertPayload): Promise<void> {
  const { error } = await supabase.from('parceiro').insert(payload)

  if (error) {
    throw new ApiError(mensagemErroSupabase(error), error.code)
  }
}

export async function atualizarParceiro(
  id: string,
  payload: ParceiroUpdatePayload,
): Promise<void> {
  const { error } = await supabase.from('parceiro').update(payload).eq('id', id)

  if (error) {
    throw new ApiError(mensagemErroSupabase(error), error.code)
  }
}
