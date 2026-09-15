/** Formata 14 dígitos como CNPJ (00.000.000/0000-00). */
export function formatarCnpj(digitos: string): string {
  const n = digitos.replace(/\D/g, '')
  if (n.length !== 14) return digitos
  return n.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function formatarMoedaBrl(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarAtivo(ativo: boolean): string {
  return ativo ? 'Sim' : 'Não'
}
