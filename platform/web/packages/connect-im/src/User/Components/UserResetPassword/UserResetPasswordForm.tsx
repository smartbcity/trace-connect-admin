import { cx } from '@emotion/css'
import { Stack, StackProps } from '@mui/material'
import {
  Form,
  FormField,
  FormPartialField,
  useFormWithPartialFields
} from '@smartb/g2-forms'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import React, { useCallback, useEffect, useMemo } from 'react'
import { UserId, UserUpdatePasswordCommand } from '../../Domain'
import { FormikHelpers } from 'formik'
import { validators } from '@smartb/g2-utils'
import { useTranslation } from 'react-i18next'

export type Validated = boolean

export interface UserResetPasswordFormClasses {
  form: string
}

export interface UserResetPasswordFormStyles {
  form: React.CSSProperties
}

export interface UserResetPasswordFormBasicProps extends BasicProps {
  /**
   * The base user
   */
  userId: UserId
  /**
   * The ref of the submit element
   */
  SubmitButtonRef?: React.RefObject<HTMLElement | undefined>
  /**
   * The submit event
   * @param user command to reset a password
   * @returns true if the Api call has been successfull
   */
  onSubmit?: (cmd: UserUpdatePasswordCommand) => Promise<boolean> | boolean
  /**
   * The classes applied to the different part of the component
   */
  classes?: UserResetPasswordFormClasses
  /**
   * The styles applied to the different part of the component
   */
  styles?: UserResetPasswordFormStyles
}

export type UserResetPasswordFormProps = MergeMuiElementProps<
  StackProps,
  UserResetPasswordFormBasicProps
>

export const UserResetPasswordForm = (props: UserResetPasswordFormProps) => {
  const {
    userId,
    onSubmit,
    classes,
    styles,
    className,
    SubmitButtonRef,
    ...other
  } = props

  const { t } = useTranslation()

  const partialFields = useMemo(
    (): FormPartialField[] => [
      {
        name: 'password',
        validator: validators.password(t)
      },
      {
        name: 'passwordCheck',
        validator: validators.passwordCheck(t)
      }
    ],
    [t]
  )

  const onSubmitMemoized = useCallback(
    async (
      values: { [key: string]: any },
      formikHelpers: FormikHelpers<any>
    ) => {
      if (onSubmit) {
        const feedback = await onSubmit({
          id: userId,
          password: values.password
        })
        if (feedback) {
          formikHelpers.resetForm()
        }
      }
    },
    [onSubmit, userId]
  )

  const formState = useFormWithPartialFields({
    fields: partialFields,
    onSubmit: onSubmitMemoized,
    formikConfig: {
      enableReinitialize: true
    }
  })

  useEffect(() => {
    const element = SubmitButtonRef?.current
    if (element) {
      element.onclick = formState.submitForm
    }
  }, [SubmitButtonRef?.current, formState.submitForm])

  const form = useMemo(
    (): FormField[] => [
      {
        key: 'password',
        name: 'password',
        type: 'textfield',
        label: t('g2.newPassword'),
        textFieldProps: {
          textFieldType: 'password'
        }
      },
      {
        key: 'passwordCheck',
        name: 'passwordCheck',
        type: 'textfield',
        label: t('g2.passwordCheck'),
        textFieldProps: {
          textFieldType: 'password'
        }
      }
    ],
    [t]
  )

  return (
    <Stack
      flexWrap='wrap'
      justifyContent='space-between'
      direction='column'
      className={cx('AruiUserResetPassword-root', className)}
      {...other}
    >
      <Form
        className={cx(
          'AruiUserResetPassword-form',
          'mainFormLeft',
          classes?.form
        )}
        style={styles?.form}
        fields={form}
        formState={formState}
      />
    </Stack>
  )
}
