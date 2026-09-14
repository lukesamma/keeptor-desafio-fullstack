import type { ParceiroFormModel } from '@/types/partnerForm'

import { apenasDigitos } from './digits'

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export type ErrosParceiroForm = Partial<Record<keyof ParceiroFormModel | 'geral', string>>

function digitoCnpj(base: string, pesos: number[]): number {
  const soma = pesos.reduce((acc, peso, i) => acc + Number(base[i]) * peso, 0)
  const resto = soma % 11
  return resto < 2 ? 0 : 11 - resto
}

/** Valida formato e dígitos verificadores do CNPJ (14 números). */
export function cnpjValido(cnpj: string): boolean {
  const n = apenasDigitos(cnpj)
  if (n.length !== 14 || /^(\d)\1{13}$/.test(n)) return false

  const base = n.slice(0, 12)
  const d1 = digitoCnpj(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = digitoCnpj(base + String(d1), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return n === base + String(d1) + String(d2)
}

export function validarParceiroForm(form: ParceiroFormModel): ErrosParceiroForm {
  const erros: ErrosParceiroForm = {}

  if (!form.razao_social.trim()) erros.razao_social = 'Informe a razão social.'
  if (!form.nome_fantasia.trim()) erros.nome_fantasia = 'Informe o nome fantasia.'

  const cnpj = apenasDigitos(form.cnpj)
  if (cnpj.length !== 14) erros.cnpj = 'CNPJ deve ter 14 dígitos.'
  else if (!cnpjValido(form.cnpj)) erros.cnpj = 'CNPJ inválido.'

  const telefone = apenasDigitos(form.telefone)
  if (telefone.length < 10 || telefone.length > 11) {
    erros.telefone = 'Telefone deve ter 10 ou 11 dígitos.'
  }

  if (!form.email.trim()) erros.email = 'Informe o e-mail.'
  else if (!EMAIL_RE.test(form.email.trim())) erros.email = 'E-mail inválido.'

  if (!form.data_inicio_relacionamento) {
    erros.data_inicio_relacionamento = 'Informe a data de início.'
  }

  const limite = form.limite_credito ?? 0
  if (limite < 0) erros.limite_credito = 'O limite não pode ser negativo.'

  if (!form.uf_id) erros.uf_id = 'Selecione a UF.'
  if (!form.municipio_id) erros.municipio_id = 'Selecione o município.'

  const cep = apenasDigitos(form.cep)
  if (cep.length !== 8) erros.cep = 'CEP deve ter 8 dígitos.'

  if (!form.bairro.trim()) erros.bairro = 'Informe o bairro.'
  if (!form.logradouro.trim()) erros.logradouro = 'Informe o logradouro.'
  if (!form.numero.trim()) erros.numero = 'Informe o número.'

  return erros
}
