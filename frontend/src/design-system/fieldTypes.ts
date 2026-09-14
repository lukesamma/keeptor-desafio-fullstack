/** Contrato comum dos campos de formulário (ver docs/ADR-002-design-system.md). */
export interface AppFieldProps {
  label?: string
  name?: string
  id?: string
  error?: string
  hint?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
}

export type AppButtonVariant = 'primary' | 'secondary' | 'danger'
