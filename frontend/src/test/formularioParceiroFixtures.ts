import type { ParceiroFormModel } from '@/types/partnerForm'
import { criarParceiroFormVazio } from '@/types/partnerForm'

/** CNPJ válido (dígitos verificadores corretos) para testes. */
export const CNPJ_VALIDO_MASCARADO = '11.222.333/0001-81'

export function formularioParceiroValido(
  overrides: Partial<ParceiroFormModel> = {},
): ParceiroFormModel {
  return {
    ...criarParceiroFormVazio(),
    razao_social: 'Keeptor Comércio LTDA',
    nome_fantasia: 'Keeptor',
    cnpj: CNPJ_VALIDO_MASCARADO,
    telefone: '11987654321',
    email: 'parceiro@keeptor.com',
    data_inicio_relacionamento: new Date(2024, 5, 1),
    limite_credito: 1500.5,
    uf_id: 35,
    municipio_id: 3550308,
    cep: '01310-100',
    bairro: 'Bela Vista',
    logradouro: 'Av. Paulista',
    numero: '1000',
    ...overrides,
  }
}
