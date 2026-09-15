import type { PostgrestError } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import {
  ApiError,
  camposErroParceiroApi,
  camposErroParceiroFromMessage,
  isErroCnpjDuplicado,
  mensagemErroSupabase,
} from './apiError'

function erroPostgrest(partial: Pick<PostgrestError, 'code' | 'message'>): PostgrestError {
  const erro = {
    ...partial,
    details: '',
    hint: '',
    name: 'PostgrestError',
  }
  return {
    ...erro,
    toJSON: () => erro,
  }
}

describe('mensagemErroSupabase', () => {
  it('mapeia unique violation de CNPJ', () => {
    const msg = mensagemErroSupabase(
      erroPostgrest({
        code: '23505',
        message: 'duplicate key value violates unique constraint "parceiro_cnpj_unico"',
      }),
    )
    expect(msg).toContain('CNPJ')
  })

  it('mapeia check violation com nome da constraint', () => {
    const msg = mensagemErroSupabase(
      erroPostgrest({
        code: '23514',
        message:
          'new row for relation "parceiro" violates check constraint "parceiro_cep_formato"',
      }),
    )
    expect(msg).toBe('CEP deve ter 8 dígitos.')
  })
})

describe('camposErroParceiroFromMessage', () => {
  it('associa constraint ao campo do formulário', () => {
    expect(
      camposErroParceiroFromMessage(
        'violates check constraint "parceiro_email_formato"',
      ),
    ).toEqual({ email: 'E-mail inválido.' })
  })
})

describe('isErroCnpjDuplicado', () => {
  it('detecta código 23505 e mensagem de CNPJ', () => {
    expect(
      isErroCnpjDuplicado(
        new ApiError('Já existe um parceiro cadastrado com este CNPJ.', '23505'),
      ),
    ).toBe(true)
    expect(
      isErroCnpjDuplicado(
        new ApiError('Já existe um parceiro cadastrado com este CNPJ.'),
      ),
    ).toBe(true)
  })
})

describe('camposErroParceiroApi', () => {
  it('ignora códigos que não são de constraint', () => {
    expect(camposErroParceiroApi(new ApiError('falha', 'PGRST301'))).toEqual({})
  })

  it('mapeia 23514 para campo', () => {
    expect(
      camposErroParceiroApi(
        new ApiError(
          'violates check constraint "parceiro_telefone_formato"',
          '23514',
        ),
      ),
    ).toEqual({ telefone: 'Telefone deve ter 10 ou 11 dígitos.' })
  })
})
