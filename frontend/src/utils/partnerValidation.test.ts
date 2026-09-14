import { describe, expect, it } from 'vitest'

import { formularioParceiroValido } from '@/test/formularioParceiroFixtures'
import { criarParceiroFormVazio } from '@/types/partnerForm'

import {
  validarCampoParceiroForm,
  validarParceiroForm,
} from './partnerValidation'

describe('validarParceiroForm', () => {
  it('retorna vazio para formulário completo e válido', () => {
    expect(validarParceiroForm(formularioParceiroValido())).toEqual({})
  })

  it('exige campos obrigatórios', () => {
    const erros = validarParceiroForm(criarParceiroFormVazio())
    expect(erros.razao_social).toBeTruthy()
    expect(erros.cnpj).toBeTruthy()
    expect(erros.email).toBeTruthy()
    expect(erros.uf_id).toBeTruthy()
    expect(erros.municipio_id).toBeTruthy()
    expect(erros.cep).toBeTruthy()
  })

  it('valida e-mail e CEP', () => {
    const erros = validarParceiroForm(
      formularioParceiroValido({
        email: 'invalido',
        cep: '123',
      }),
    )
    expect(erros.email).toBe('E-mail inválido.')
    expect(erros.cep).toBe('CEP deve ter 8 dígitos.')
  })

  it('não permite limite de crédito negativo', () => {
    const erros = validarParceiroForm(
      formularioParceiroValido({ limite_credito: -1 }),
    )
    expect(erros.limite_credito).toBe('O limite não pode ser negativo.')
  })
})

describe('validarCampoParceiroForm', () => {
  it('retorna mensagem só do campo solicitado', () => {
    const form = formularioParceiroValido({ email: 'x' })
    expect(validarCampoParceiroForm(form, 'email')).toBe('E-mail inválido.')
    expect(validarCampoParceiroForm(form, 'cnpj')).toBeUndefined()
  })
})
