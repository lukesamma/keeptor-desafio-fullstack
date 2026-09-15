/** Converte `Date` local para `YYYY-MM-DD` (coluna `date` no Postgres). */
export function formatarDataIso(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

/** Converte `YYYY-MM-DD` (Postgres `date`) para `Date` local. */
export function parseDataIso(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}
