import { useMemo } from 'react'
import { FormComposableField } from '@smartb/g2-composable'

export interface DeletableFormParams<
  T extends FormComposableField<string, {}> = FormComposableField<string, {}>
> {
  initialFields: T[]
  additionalFields?: T[]
  /**
   * The names of the fields to block
   */
  blockedFields?: string[]
}

export const useDeletableForm = <
  T extends FormComposableField<string, {}> = FormComposableField<string, {}>
>(
  deletePrams: DeletableFormParams<T>
) => {
  const { initialFields, blockedFields, additionalFields = [] } = deletePrams
  const fields = useMemo(() => {
    const fields: T[] = [...initialFields, ...additionalFields]
    const fieldsFiltered = blockedFields
      ? fields.filter((field) => !blockedFields.includes(field.name as string))
      : fields
    return fieldsFiltered
  }, [initialFields, additionalFields, blockedFields])
  return fields
}
