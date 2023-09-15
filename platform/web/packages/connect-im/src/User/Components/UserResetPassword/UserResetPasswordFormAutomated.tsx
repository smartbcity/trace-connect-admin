import { useCallback } from 'react'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { UserId, UserResetPasswordCommand, UserUpdatePasswordCommand, UserUpdatePasswordResult } from '../../Domain'
import {
  UserResetPasswordForm,
  UserResetPasswordFormProps
} from './UserResetPasswordForm'
import { useUserUpdatePassword } from '../..'
import { CommandOptions } from '@smartb/g2-utils'

export interface UserResetPasswordFormAutomatedBasicProps extends BasicProps {
  /**
   * The id of the user
   */
  userId: UserId
  /**
   * The userUpdatePassword hook options
   */
  userUpdatePasswordOptions?: CommandOptions<UserResetPasswordCommand, UserUpdatePasswordResult>
}

export type UserResetPasswordFormAutomatedProps = MergeMuiElementProps<
  UserResetPasswordFormProps,
  UserResetPasswordFormAutomatedBasicProps
>

export const UserResetPasswordFormAutomated = (
  props: UserResetPasswordFormAutomatedProps
) => {
  const { userId, userUpdatePasswordOptions, ...other } = props

  const userUpdatePassword = useUserUpdatePassword({
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
