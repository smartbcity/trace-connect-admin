import { useCallback } from 'react'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { UserId, UserUpdatePasswordCommand } from '../../Domain'
import {
  UserResetPasswordForm,
  UserResetPasswordFormProps
} from './UserResetPasswordForm'
import { useUserUpdatePassword, UserUpdatePasswordOptions } from '../..'
import { i2Config, useAuth } from '@smartb/g2-providers'

export interface UserResetPasswordFormAutomatedBasicProps extends BasicProps {
  /**
   * The id of the user
   */
  userId: UserId
  /**
   * The userUpdatePassword hook options
   */
  userUpdatePasswordOptions?: UserUpdatePasswordOptions
}

export type UserResetPasswordFormAutomatedProps = MergeMuiElementProps<
  UserResetPasswordFormProps,
  UserResetPasswordFormAutomatedBasicProps
>

export const UserResetPasswordFormAutomated = (
  props: UserResetPasswordFormAutomatedProps
) => {
  const { userId, userUpdatePasswordOptions, ...other } = props

  const { keycloak } = useAuth()

  const userUpdatePassword = useUserUpdatePassword({
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token,
    options: userUpdatePasswordOptions
  })

  const handleResetPasswordSubmit = useCallback(
    async (cmd: UserUpdatePasswordCommand) => {
      const result = await userUpdatePassword.mutateAsync(cmd)
      return !!result
    },
    [userUpdatePassword.mutateAsync]
  )

  return (
    <UserResetPasswordForm
      userId={userId}
      onSubmit={handleResetPasswordSubmit}
      {...other}
    />
  )
}
