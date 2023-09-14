import { FormComposableField } from '@smartb/g2-composable'
import { useMemo } from 'react'
import { Address, mergeFields } from '.'
import { validators } from '@smartb/g2-utils'
import { useTranslation } from 'react-i18next'

export type AdressFieldsName = 'street' | 'postalCode' | 'city'

export type AdressReadOnlyFields = {
  [k in keyof Address]?: boolean
}

export type AdressFieldsOverride = Partial<
  Record<AdressFieldsName, Partial<FormComposableField<AdressFieldsName>>>
>

export interface useAdressFieldsParams {
  /**
   * use This prop to override the fields
   */
  fieldsOverride?: AdressFieldsOverride
}

export const useAdressFields = (params?: useAdressFieldsParams) => {
  const { fieldsOverride } = params || {}

  const { t } = useTranslation()

  const addressFields = useMemo(
    () => ({
      street: mergeFields<FormComposableField<AdressFieldsName>>(
        {
          name: 'street',
          type: 'textField',
          label: t('g2.facultativeField', { label: t('g2.address') }),
          validator: validators.street(t)
        },
        fieldsOverride?.street
      ),
      postalCode: mergeFields<FormComposableField<AdressFieldsName>>(
        {
          name: 'postalCode',
          type: 'textField',
          label: t('g2.facultativeField', { label: t('g2.postalCode') }),
          validator: validators.postalCode(t)
        },
        fieldsOverride?.postalCode
      ),
      city: mergeFields<FormComposableField<AdressFieldsName>>(
        {
          name: 'city',
          type: 'textField',
          label: t('g2.facultativeField', { label: t('g2.city') }),
          validator: validators.city(t)
        },
        fieldsOverride?.city
      )
    }),
    [t, fieldsOverride]
  )

  return {
    addressFields
  }
}
