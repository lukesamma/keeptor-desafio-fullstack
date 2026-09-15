import { describe, expect, it } from 'vitest'

import { CNPJ_VALIDO_MASCARADO } from '@/test/formularioParceiroFixtures'

import { cnpjValido } from './cnpj'

describe('cnpjValido', () => {
  it('aceita CNPJ com máscara e dígitos verificadores corretos', () => {
    expect(cnpjValido(CNPJ_VALIDO_MASCARADO)).toBe(true)
    expect(cnpjValido('11222333000181')).toBe(true)
  })

  it('rejeita tamanho diferente de 14 dígitos', () => {
    expect(cnpjValido('123')).toBe(false)
    expect(cnpjValido('11.222.333/0001-8')).toBe(false)
  })

  it('rejeita sequência repetida', () => {
    expect(cnpjValido('11.111.111/1111-11')).toBe(false)
  })

  it('rejeita dígitos verificadores inválidos', () => {
    expect(cnpjValido('11.222.333/0001-80')).toBe(false)
  })
})
