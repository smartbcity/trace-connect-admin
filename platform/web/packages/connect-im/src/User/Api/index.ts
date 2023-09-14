import {
  User,
  UserResetPasswordCommand,
  UserUpdatedEmailEvent,
  UserUpdateEmailCommand,
  UserUpdatePasswordCommand,
  UserUpdatePasswordResult
} from '../Domain'
import { useCallback } from 'react'
import { request } from '@smartb/g2-utils'
import {
  QueryFunctionContext,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'
import { OrganizationId, OrganizationRef } from '../../Organization'
import { UserPageResult } from '../Domain'

type UserGetAllQueryResultOptional<T extends User = User> = {
  users: T[]
  totalPages: number
}

export type GetUsersOptions<T extends User = User> = Omit<
  UseQueryOptions<
    UserGetAllQueryResultOptional<T>,
    unknown,
    UserGetAllQueryResultOptional<T>,
    any[]
  >,
  'queryKey' | 'queryFn'
>

export interface GetUsersParams<T extends User = User> {
  /**
   * @default "organization"
   */
  queryKey?: string
  jwt?: string
  apiUrl: string
  options?: GetUsersOptions<T>
  queryParams?: any
}

export const useGetUsers = <T extends User = User>(
  params: GetUsersParams<T>
) => {
  const { apiUrl, jwt, options, queryKey = 'users', queryParams } = params

  const getUsers = useCallback(
    async ({ queryKey }: QueryFunctionContext<[string, any]>) => {
      const [_key, currentParams] = queryKey
      const res = await request<UserPageResult<T>[]>({
        url: `${apiUrl}/userPage`,
        method: 'POST',
        body: JSON.stringify({
          ...currentParams,
          size: currentParams?.size ?? 10
        }),
        jwt: jwt
      })
      if (res) {
        return {
          users: res[0]?.items,
          totalPages: Math.ceil(res[0]?.total / 10)
        }
      } else {
        return {
          items: [],
          total: 0
        }
      }
    },
    [apiUrl, jwt]
  )
    //@ts-ignore
  return useQuery([queryKey, queryParams], getUsers, options)
}

export type GetUserOptions<T extends User = User> = Omit<
  UseQueryOptions<T | null, unknown, T | null, (string | undefined)[]>,
  'queryKey' | 'queryFn'
>

export interface GetUserParams<T extends User = User> {
  /**
   * @default "organization"
   */
  queryKey?: string
  jwt?: string
  userId?: string
  organizationId?: OrganizationId
  apiUrl: string
  options?: GetUserOptions<T>
}

export const useGetUser = <T extends User = User>(params: GetUserParams<T>) => {
  const {
    apiUrl,
    jwt,
    options,
    userId,
    organizationId,
    queryKey = 'user'
  } = params

  const getUser = useCallback(
    async ({
      queryKey
    }: QueryFunctionContext<[string, string]>): Promise<T | null> => {
      const [_key, userId] = queryKey
      const res = await request<{ item: T }[]>({
        url: `${apiUrl}/userGet`,
        method: 'POST',
        body: JSON.stringify({
          id: userId
        }),
        jwt: jwt
      })
      if (res) {
        // @ts-ignore
        return {
          ...res[0].item,
          memberOf:
            res[0]?.item?.memberOf ??
            ({ id: organizationId, name: '' } as OrganizationRef)
        }
      } else {
        return null
      }
    },
    [apiUrl, jwt, userId, organizationId]
  )

  //@ts-ignore
  return useQuery([queryKey, userId], getUser, {
    enabled: !!userId,
    ...options
  })
}

export type UpdateUserOptions<T extends User = User> = Omit<
  UseMutationOptions<{ id: string } | undefined, unknown, T, unknown>,
  'mutationFn'
>

export interface UpdateUserParams<T extends User> {
  jwt?: string
  apiUrl: string
  options?: UpdateUserOptions<T>
}

export const useUpdateUser = <T extends User = User>(
  params: UpdateUserParams<T>
) => {
  const { apiUrl, jwt, options } = params

  const updateUser = useCallback(
    async (user: T) => {
      const res = await request<{ id: string }[]>({
        url: `${apiUrl}/userUpdate`,
        method: 'POST',
        body: JSON.stringify({
          ...user,
          memberOf: user.memberOf?.id
        }),
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

  return useMutation(updateUser, options)
}

export type CreateUserOptions<T extends User = User> = Omit<
  UseMutationOptions<{ id: string } | undefined, unknown, T, unknown>,
  'mutationFn'
>

export interface CreateUserParams<T extends User> {
  jwt?: string
  apiUrl: string
  organizationId?: OrganizationId
  options?: CreateUserOptions<T>
}

export const useCreateUser = <T extends User = User>(
  params: CreateUserParams<T>
) => {
  const { apiUrl, jwt, options, organizationId } = params

  const createUser = useCallback(
    async (user: T) => {
      const res = await request<{ id: string }[]>({
        url: `${apiUrl}/userCreate`,
        method: 'POST',
        // @ts-ignore
        body: JSON.stringify({
          ...user,
          memberOf: user.memberOf?.id ?? organizationId
        } as T),
        jwt: jwt
      })
      if (res) {
        return res[0]
      } else {
        return undefined
      }
    },
    [apiUrl, jwt, organizationId]
  )

  return useMutation(createUser, options)
}

export type UserUpdatePasswordOptions = Omit<
  UseMutationOptions<
    UserUpdatePasswordResult | undefined,
    unknown,
    UserUpdatePasswordCommand | undefined,
    unknown
  >,
  'mutationFn'
>

export interface UserUpdatePasswordParams {
  jwt?: string
  apiUrl: string
  options?: UserUpdatePasswordOptions
}

export const useUserUpdatePassword = (params: UserUpdatePasswordParams) => {
  const { apiUrl, jwt, options } = params

  const resetUserPassword = useCallback(
    async (
      cmd?: UserUpdatePasswordCommand
    ): Promise<UserUpdatePasswordResult | undefined> => {
      const res = await request<UserUpdatePasswordResult[]>({
        url: `${apiUrl}/userUpdatePassword`,
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

  return useMutation(resetUserPassword, options)
}

export type UserResetPasswordOptions = Omit<
  UseMutationOptions<
    UserUpdatePasswordResult | undefined,
    unknown,
    UserResetPasswordCommand | undefined,
    unknown
  >,
  'mutationFn'
>

export interface UserResetPasswordParams {
  jwt?: string
  apiUrl: string
  options?: UserResetPasswordOptions
}

export const useUserResetPassword = (params: UserResetPasswordParams) => {
  const { apiUrl, jwt, options } = params

  const resetUserPassword = useCallback(
    async (cmd?: {
      id: string
    }): Promise<UserUpdatePasswordResult | undefined> => {
      const res = await request<UserUpdatePasswordResult[]>({
        url: `${apiUrl}/userResetPassword`,
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

  return useMutation(resetUserPassword, options)
}

export type UserUpdateEmailOptions = Omit<
  UseMutationOptions<
    UserUpdatedEmailEvent | undefined,
    unknown,
    UserUpdateEmailCommand | undefined,
    unknown
  >,
  'mutationFn'
>

export interface UserUpdateEmailParams {
  jwt?: string
  apiUrl: string
  options?: UserUpdateEmailOptions
}

export const useUserUpdateEmail = (params: UserUpdateEmailParams) => {
  const { apiUrl, jwt, options } = params

  const updateEmail = useCallback(
    async (
      cmd?: UserUpdateEmailCommand
    ): Promise<UserUpdatedEmailEvent | undefined> => {
      const res = await request<UserUpdatedEmailEvent[]>({
        url: `${apiUrl}/userUpdateEmail`,
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

  return useMutation(updateEmail, options)
}

export const userExistsByEmail = async (
  email: string,
  apiUrl: string,
  jwt?: string
) => {
  const res = await request<{ item?: boolean }[]>({
    url: `${apiUrl}/userExistsByEmail`,
    method: 'POST',
    body: JSON.stringify({
      email: email
    }),
    jwt: jwt
  })
  if (res) {
    return res[0].item
  } else {
    return undefined
  }
}

export * from './UserDisableFunction'
