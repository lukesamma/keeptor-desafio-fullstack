import type { ZodError } from 'zod'

/** Primeira mensagem por campo (path[0]) a partir de um ZodError. */
export function zodErrosPorCampo<T extends string>(
  error: ZodError,
): Partial<Record<T, string>> {
  const erros: Partial<Record<T, string>> = {}

  for (const issue of error.issues) {
    const chave = issue.path[0]
    if (typeof chave !== 'string') continue
    const campo = chave as T
    if (erros[campo]) continue
    erros[campo] = issue.message
  }

  return erros
}
