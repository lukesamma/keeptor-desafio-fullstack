export interface Uf {
  id: number
  sigla: string
  nome: string
}

export interface Municipio {
  id: number
  nome: string
  uf_id: number
}

export interface UfOpcao extends Uf {
  label: string
}
