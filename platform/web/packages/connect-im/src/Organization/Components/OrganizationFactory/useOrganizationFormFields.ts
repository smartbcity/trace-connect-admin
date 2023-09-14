import { FormComposableField, FormComposableState } from '@smartb/g2-composable'
import { useMemo, useCallback, useState } from 'react'
import {
  AdressFieldsName,
  mergeFields,
  useAdressFields
} from '../../../Commons'
import { FlatOrganization, Organization, organizationToFlatOrganization } from '../../Domain'
import { siretValidation } from '../../Validation/siret'
import { validators } from '@smartb/g2-utils'
import { useTranslation } from 'react-i18next'

export type organizationFieldsName =
  | 'logo'
  | 'siret'
  | 'name'
  | 'description'
  | 'website'
  | 'roles'
  | AdressFieldsName

export type OrganizationFactoryFieldsOverride = Partial<
  Record<
    organizationFieldsName,
    Partial<FormComposableField<organizationFieldsName>>
  >
>

export interface useOrganizationFormFieldsProps {
  /**
   * The event called after the research on the siret field
   * that should fill as much as it can the organization type
   */
  getInseeOrganization?: (siret: string) => Promise<Organization | undefined>
  /**
   * The event called after the insee api call.
   */
  setInseeOrganization?: (organization: any) => void
  /**
   * The state of the form obtainable by calling useOrganizationFormState
   */
  formState?: FormComposableState
  /**
   * use This prop to override the fields
   */
  fieldsOverride?: OrganizationFactoryFieldsOverride
  /**
   * Allow the organization to have multipe roles
   *
   * @default true
   */
  multipleRoles?: boolean
}

export const useOrganizationFormFields = (
  params?: useOrganizationFormFieldsProps
) => {
  const {
    formState,
    getInseeOrganization,
    setInseeOrganization,
    multipleRoles = true,
    fieldsOverride
  } = params ?? {}

  const [siretValid, setSiretValid] = useState(false)
  const [siretRef, setSiretRef] = useState(null)
  const { t } = useTranslation()

  const fetchOrganization = useCallback(async () => {
    if (getInseeOrganization && formState?.values.siret) {
      await getInseeOrganization(formState.values.siret).then((values) => {
        if (values) {
          const flat = organizationToFlatOrganization(values)
          Object.keys(flat).forEach((k) => {
            const key = k as keyof FlatOrganization
            if (flat[key] == null) delete flat[key]
          })
          formState.setValues(
            (oldValues) => ({
              ...oldValues,
              ...flat
            }),
            false
          )
          setSiretValid(true)
          setInseeOrganization && setInseeOrganization(values)
        } else {
          formState.setFieldError('siret', t('g2.siretNotFound'))
        }
      })
    }
  }, [
    formState?.values.siret,
    formState?.setValues,
    formState?.setFieldError,
    getInseeOrganization,
    t,
    setInseeOrganization
  ])

  const { addressFields } = useAdressFields({
    //@ts-ignore
    fieldsOverride
  })

  const fields = useMemo(
    (): Record<
      organizationFieldsName,
      FormComposableField<organizationFieldsName>
    > => ({
      logo: mergeFields<FormComposableField<organizationFieldsName>>(
        {
          name: 'logo',
          label: t('g2.facultativeField', { label: t('g2.logo') }),
          type: 'dropPicture',
          params: {
            alt: "Le logo de l'entreprise",
            height: '200px'
          }
        },
        fieldsOverride?.logo
      ),
      siret: mergeFields<FormComposableField<organizationFieldsName>>(
        {
          name: 'siret',
          label: t('g2.siret'),
          type: 'textField',
          params: {
            textFieldType: 'search',
            iconPosition: 'end',
            noCheckOrClearIcon: true,
            validated: siretValid,
            // @ts-ignore
            ref: setSiretRef,
            onSearch: async () => {
              setSiretValid(false)
              if (!!formState && !(await formState.validateField('siret'))) {
                await fetchOrganization()
              }
            }
          },
          validator: (value: any) =>
            siretValidation(value, fieldsOverride?.siret?.readOnly)
        },
        fieldsOverride?.siret
      ),
      name: mergeFields<FormComposableField<organizationFieldsName>>(
        {
          name: 'name',
          type: 'textField',
          label: t('g2.name'),
          validator: validators.requiredField(t)
        },
        fieldsOverride?.name
      ),
      roles: mergeFields<FormComposableField<organizationFieldsName>>(
        {
          name: 'roles',
          label: t('g2.roles'),
          type: 'select',
          params: {
            readOnlyType: 'chip',
            multiple: multipleRoles
          },
          validator: validators.requiredField(t)
        },
        fieldsOverride?.roles
      ),
      ...addressFields,
      website: mergeFields<FormComposableField<organizationFieldsName>>(
        {
          name: 'website',
          type: 'textField',
          label: t('g2.facultativeField', { label: t('g2.website') })
        },
        fieldsOverride?.website
      ),
      description: mergeFields<FormComposableField<organizationFieldsName>>(
        {
          name: 'description',
          type: 'textField',
          label: t('g2.facultativeField', { label: t('g2.description') }),
          params: {
            multiline: true,
            rows: 6
          }
        },
        fieldsOverride?.description
      )
    }),
    [
      t,
      addressFields,
      t,
      siretValid,
      fetchOrganization,
      formState?.validateField,
      multipleRoles,
      fieldsOverride
    ]
  )

  const fieldsArray = useMemo(() => Object.values(fields), [fields])

  return {
    fields,
    siretValid,
    siretRef,
    fieldsArray
  }
}
