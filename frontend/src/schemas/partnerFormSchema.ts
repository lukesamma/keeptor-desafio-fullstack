import { z } from 'zod'

import type { ParceiroFormModel } from '@/types/partnerForm'
import { cnpjValido } from '@/utils/cnpj'
import { apenasDigitos } from '@/utils/digits'

/**
 * Espelha CHECK/NOT NULL de `backend/migrations/0003_parceiros.sql`.
 * O PostgreSQL continua sendo a fonte de verdade em concorrência e bypass do client.
 */
export const parceiroFormSchema = z.object({
  razao_social: z.string().trim().min(1, 'Informe a razão social.'),
  nome_fantasia: z.string().trim().min(1, 'Informe o nome fantasia.'),
  cnpj: z.string().superRefine((valor, ctx) => {
    const digitos = apenasDigitos(valor)
    if (digitos.length !== 14) {
      ctx.addIssue({ code: 'custom', message: 'CNPJ deve ter 14 dígitos.' })
      return
    }
    if (!cnpjValido(valor)) {
      ctx.addIssue({ code: 'custom', message: 'CNPJ inválido.' })
    }
  }),
  inscricao_estadual: z.string(),
  telefone: z.string().superRefine((valor, ctx) => {
    const digitos = apenasDigitos(valor)
    if (digitos.length < 10 || digitos.length > 11) {
      ctx.addIssue({
        code: 'custom',
        message: 'Telefone deve ter 10 ou 11 dígitos.',
      })
    }
  }),
  email: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail.')
    .email('E-mail inválido.'),
  data_inicio_relacionamento: z
    .date({ message: 'Informe a data de início.' })
    .nullable()
    .refine((data) => data !== null, 'Informe a data de início.'),
  limite_credito: z
    .number({ message: 'Informe o limite de crédito.' })
    .nullable()
    .transform((valor) => valor ?? 0)
    .pipe(z.number().min(0, 'O limite não pode ser negativo.')),
  ativo: z.boolean(),
  uf_id: z
    .number()
    .nullable()
    .refine((id) => id !== null, 'Selecione a UF.'),
  municipio_id: z
    .number()
    .nullable()
    .refine((id) => id !== null, 'Selecione o município.'),
  cep: z.string().superRefine((valor, ctx) => {
    if (apenasDigitos(valor).length !== 8) {
      ctx.addIssue({ code: 'custom', message: 'CEP deve ter 8 dígitos.' })
    }
  }),
  bairro: z.string().trim().min(1, 'Informe o bairro.'),
  logradouro: z.string().trim().min(1, 'Informe o logradouro.'),
  numero: z.string().trim().min(1, 'Informe o número.'),
  complemento: z.string(),
}) satisfies z.ZodType<ParceiroFormModel>
