import { computed, useId, type ComputedRef } from 'vue'

import type { AppFieldProps } from './fieldTypes'

export interface FieldIds {
  inputId: string
  errorId: string
  hintId: string
  describedBy: ComputedRef<string | undefined>
}

export function useFieldIds(props: Pick<AppFieldProps, 'id' | 'error' | 'hint'>): FieldIds {
  const auto = useId()
  const inputId = props.id ?? `app-field-${auto}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  const describedBy = computed(() => {
    if (props.error) return errorId
    if (props.hint) return hintId
    return undefined
  })

  return { inputId, errorId, hintId, describedBy }
}
