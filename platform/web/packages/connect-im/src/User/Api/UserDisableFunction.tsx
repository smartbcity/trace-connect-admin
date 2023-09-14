import { UserId } from '../Domain'
import {
  CommandParams,
  request,
  RequestProps,
  useCommandRequest
} from '@smartb/g2-utils'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

export interface UserDisableCommand {
  id: UserId
  disabledBy?: UserId
  anonymize: Boolean
  attributes?: Record<string, string>
}

export interface UserDisabledEvent {
  id: UserId
  userIds: string[]
}

export const useUserDisable = (
  props: RequestProps,
  params: CommandParams<UserDisableCommand, UserDisabledEvent>
) => {
  return useCommandRequest<UserDisableCommand, UserDisabledEvent>(
    'userDisable',
    props,
    params
  )
}

export type UserDisableOptions = Omit<
  UseMutationOptions<
    undefined | { id: string },
    unknown,
    UserDisableCommand,
    unknown
  >,
  'mutationFn'
>

export interface UserDisableParams {
  jwt?: string
  apiUrl: string
  options?: UserDisableOptions
}

export const useUserDisable2 = (params: UserDisableParams) => {
  const { apiUrl, jwt, options } = params
  // TODO Remove all duplicated code with other request
  const userDisable = useCallback(
    async (cmd: UserDisableCommand) => {
      const res = await request<{ id: string }[]>({
        url: `${apiUrl}/userDisable`,
        method: 'POST',
        body: JSON.stringify(cmd),
        jwt: jwt
      })
      if (res) {
        return res[0]
      } else {
        return undefined
      }
    },
    [apiUrl, jwt]
  )

  return useMutation(userDisable, options)
}
