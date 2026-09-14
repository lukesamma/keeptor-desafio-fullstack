/** Registro completo de `public.parceiro` (espelho da migration). */
export interface Parceiro {
  id: string
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
  created_at: string
  updated_at: string
}

export interface MunicipioResumo {
  nome: string
  uf: {
    sigla: string
  } | null
}

/** Linha retornada por `listarParceiros()` com município embutido. */
export interface ParceiroListagem {
  id: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  ativo: boolean
  limite_credito: number
  data_inicio_relacionamento: string
  municipio: MunicipioResumo | null
}

/** Linha achatada para a tabela de listagem. */
export interface ParceiroLinhaTabela {
  id: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  localidade: string
  limite_credito: number
  ativo: boolean
}
