import { supabase } from '@/lib/supabase'
import type { Municipio, Uf, UfOpcao } from '@/types/geo'

import { ApiError, mensagemErroSupabase } from './apiError'

export async function listarUfs(): Promise<UfOpcao[]> {
  const { data, error } = await supabase
    .from('uf')
    .select('id, sigla, nome')
    .order('sigla')

  if (error) {
    throw new ApiError(mensagemErroSupabase(error), error.code)
  }

  return ((data ?? []) as Uf[]).map((uf) => ({
    ...uf,
    label: `${uf.sigla} — ${uf.nome}`,
  }))
}

export async function listarMunicipiosPorUf(ufId: number): Promise<Municipio[]> {
  const { data, error } = await supabase
    .from('municipio')
    .select('id, nome, uf_id')
    .eq('uf_id', ufId)
    .order('nome')

  if (error) {
    throw new ApiError(mensagemErroSupabase(error), error.code)
  }

  return (data ?? []) as Municipio[]
}
