import { apenasDigitos } from './digits'

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
