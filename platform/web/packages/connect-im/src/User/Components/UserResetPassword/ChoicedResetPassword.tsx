import { Box, InputLabel, Typography } from '@mui/material'
import { Action, Link } from '@smartb/g2-components'
import { PopUp } from '@smartb/g2-layout'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useUserResetPassword } from '../../Api'
import {
  UserResetPasswordFormAutomated,
  UserResetPasswordFormAutomatedProps
} from './UserResetPasswordFormAutomated'
import { useTranslation } from 'react-i18next'

export interface ChoicedResetPasswordBasicProps extends BasicProps {
  /**
   * The type of the reset password
   *
   * @defautl 'email'
   */
  resetPasswordType?: 'email' | 'forced'
}

export type ChoicedResetPasswordProps = MergeMuiElementProps<
  UserResetPasswordFormAutomatedProps,
  ChoicedResetPasswordBasicProps
>

export const ChoicedResetPassword = (props: ChoicedResetPasswordProps) => {
  const {
    resetPasswordType = 'email',
    userId,
    userUpdatePasswordOptions,
    ...other
  } = props
  const [open, setOpen] = useState(false)
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState(false)
  const submitRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const onToggle = useCallback(() => {
    setOpen((open) => !open)
  }, [])

  const onSuccess = useCallback(
    //@ts-ignore
    (data, varaibles, context) => {
      setMutating(false)
      onToggle()
      userUpdatePasswordOptions?.onSuccess &&
        userUpdatePasswordOptions.onSuccess(data, varaibles, context)
    },
    [onToggle, userUpdatePasswordOptions?.onSuccess]
  )

  const onMutate = useCallback(
    //@ts-ignore
    (varaibles) => {
      setMutating(true)
      userUpdatePasswordOptions?.onMutate &&
        userUpdatePasswordOptions.onMutate(varaibles)
    },
    [userUpdatePasswordOptions?.onMutate]
  )

  const onError = useCallback(
    //@ts-ignore
    (error, varaibles, context) => {
      setMutating(false)
      setError(true)
      userUpdatePasswordOptions?.onError &&
        userUpdatePasswordOptions.onError(error, varaibles, context)
    },
    [userUpdatePasswordOptions?.onError]
  )

  const userResetPassword = useUserResetPassword({
    options: {
      ...userUpdatePasswordOptions,
      onMutate,
      onSuccess,
      onError
    }
  })

  const actions = useMemo(
    (): Action[] => [
      {
        label: t('g2.cancel'),
        key: 'cancelPopupButton',
        onClick: onToggle,
        variant: 'text'
      },
      {
        label: t('g2.confirm'),
        key: 'confirmPopupButton',
        ref: submitRef,
        isLoading: mutating,
        fail: error,
        onClick: () => {
          if (resetPasswordType === 'email') {
            userResetPassword.mutate({ id: userId })
          }
        }
      }
    ],
    [onToggle, mutating, error, t, userId]
  )

  return (
    <Box>
      <InputLabel
        sx={{
          marginBottom: (theme) => theme.spacing(1),
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#000000'
        }}
      >
        {t('g2.password')}
      </InputLabel>
      <Link onClick={onToggle} sx={{ color: '#1E88E5', cursor: 'pointer' }}>
        {t('g2.changePassword')}
      </Link>
      <PopUp onClose={onToggle} open={open} actions={actions}>
        <Typography variant='h6' style={{ marginBottom: '15px' }}>
          {t('g2.passwordChangement')}
        </Typography>
        {resetPasswordType === 'email' ? (
          <Typography variant='body1'>{t('g2.passwordEmail')}</Typography>
        ) : (
          <UserResetPasswordFormAutomated
            userUpdatePasswordOptions={{
              ...userUpdatePasswordOptions,
              onMutate,
              onSuccess,
              onError
            }}
            SubmitButtonRef={submitRef}
            userId={userId}
            {...other}
          />
        )}
      </PopUp>
    </Box>
  )
}
