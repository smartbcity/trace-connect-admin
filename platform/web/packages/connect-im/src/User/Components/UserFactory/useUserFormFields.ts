import { FormComposableField } from '@smartb/g2-composable'
import { useCallback, useMemo, useState } from 'react'
import {
  AdressFieldsName,
  mergeFields,
  useAdressFields
} from '../../../Commons'
import { OrganizationId } from '../../../Organization'
import { User } from '../../Domain'
import { validators } from '@smartb/g2-utils'
import { useTranslation } from 'react-i18next'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i

export type userFieldsName =
  | 'givenName'
  | 'familyName'
  | 'email'
  | 'phone'
  | 'roles'
  | 'memberOf'
  | 'sendVerifyEmail'
  | 'sendResetPassword'
  | AdressFieldsName

export type UserFactoryFieldsOverride = Partial<
  Record<userFieldsName, Partial<FormComposableField<userFieldsName>>>
>

export interface UseUserFormFieldsProps<T extends User> {
  /**
   * use This prop to override the fields
   */
  fieldsOverride?: UserFactoryFieldsOverride
  /**
   * Allow the user to have multipe roles
   *
   * @default true
   */
  multipleRoles?: boolean
  /**
   * The event called to check if the email is available
   */
  checkEmailValidity?: (email: string) => Promise<boolean | undefined>
  /**
   * If you want the organization to transform to a link
   */
  getOrganizationUrl?: (organizationId: OrganizationId) => string
  /**
   * Indicates if it's an update
   * @default false
   */
  update?: boolean
  /**
   * The initial user object
   */
  user?: T
  /**
   * To activate ReadOnly view
   * @default false
   */
  readOnly?: boolean
  /**
   * The organizationId of the user. Needed if you want to preSelect it when you are creating a user
   */
  organizationId?: OrganizationId
}

export const useUserFormFields = <T extends User = User>(
  params?: UseUserFormFieldsProps<T>
) => {
  const {
    fieldsOverride,
    checkEmailValidity,
    update = false,
    readOnly = false,
    organizationId,
    user,
    multipleRoles = true,
    getOrganizationUrl
  } = params ?? {}

  const [emailValid, setEmailValid] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const { t } = useTranslation()

  const onCheckEmail = useCallback(
    async (email: string): Promise<string | undefined> => {
      if (user?.email !== email && checkEmailValidity) {
        setEmailLoading(true)
        const isTaken = await checkEmailValidity(email)
        setEmailLoading(false)
        if (isTaken === true) {
          setEmailValid(false)
          return t('g2.emailAlreadyUsed')
        } else if (isTaken === false) {
          setEmailValid(true)
        }
      }
      return undefined
    },
    [user?.email, checkEmailValidity, t]
  )

  const { addressFields } = useAdressFields({
    //@ts-ignore
    fieldsOverride
  })

  const fields = useMemo(
    (): Record<userFieldsName, FormComposableField<userFieldsName>> => ({
      givenName: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'givenName',
          type: 'textField',
          label: t('g2.givenName'),
          validator: validators.requiredField(t)
        },
        fieldsOverride?.givenName
      ),
      familyName: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'familyName',
          type: 'textField',
          label: t('g2.familyName'),
          validator: validators.requiredField(t)
        },
        fieldsOverride?.familyName
      ),
      memberOf: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'memberOf',
          label: t('g2.memberOf'),
          type: 'select',
          params: {
            //@ts-ignore
            getReadOnlyTextUrl: getOrganizationUrl
          }
        },
        fieldsOverride?.memberOf
      ),
      roles: mergeFields<FormComposableField<userFieldsName>>(
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
      email: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'email',
          type: 'textField',
          label: t('g2.email'),
          params: {
            textFieldType: 'email',
            searchLoading: emailLoading,
            validated: emailValid
          },
          validator: async (value?: string) => {
            if (fieldsOverride?.email?.readOnly) return undefined
            const trimmed = (value ?? '').trim()
            if (!trimmed) return t('g2.completeTheEmail')
            if (!emailRegex.test(trimmed)) return t('g2.enterAValidEmail')
            return await onCheckEmail(trimmed)
          }
        },
        fieldsOverride?.email
      ),
      phone: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'phone',
          type: 'textField',
          label: t('g2.facultativeField', { label: t('g2.phone') })
        },
        fieldsOverride?.phone
      ),
      sendVerifyEmail: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'sendVerifyEmail',
          type: 'checkBox',
          label: t('g2.sendVerifyEmail'),
          params: {
            disabled: fieldsOverride?.sendVerifyEmail?.readOnly
          }
        },
        fieldsOverride?.sendVerifyEmail
      ),
      sendResetPassword: mergeFields<FormComposableField<userFieldsName>>(
        {
          name: 'sendResetPassword',
          type: 'checkBox',
          label: t('g2.sendResetPassword'),
          params: {
            disabled: fieldsOverride?.sendResetPassword?.readOnly
          }
        },
        fieldsOverride?.sendResetPassword
      )
    }),
    [
      t,
      fieldsOverride,
      organizationId,
      multipleRoles,
      addressFields,
      emailLoading,
      onCheckEmail,
      update,
      readOnly
    ]
  )

  const fieldsArray = useMemo(() => Object.values(fields), [fields])

  return {
    emailLoading,
    emailValid,
    fields,
    fieldsArray
  }
}
