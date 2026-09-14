import { parceiroFormSchema } from '@/schemas/partnerFormSchema'
import type { ParceiroFormModel } from '@/types/partnerForm'

import { zodErrosPorCampo } from './zodFieldErrors'

export type ErrosParceiroForm = Partial<
  Record<keyof ParceiroFormModel | 'geral', string>
>

export function validarParceiroForm(form: ParceiroFormModel): ErrosParceiroForm {
  const resultado = parceiroFormSchema.safeParse(form)
  if (resultado.success) return {}
  return zodErrosPorCampo<keyof ParceiroFormModel>(resultado.error)
}

export function validarCampoParceiroForm(
  form: ParceiroFormModel,
  campo: keyof ParceiroFormModel,
): string | undefined {
  const resultado = parceiroFormSchema.safeParse(form)
  if (resultado.success) return undefined

  const issue = resultado.error.issues.find((item) => item.path[0] === campo)
  return issue?.message
}
