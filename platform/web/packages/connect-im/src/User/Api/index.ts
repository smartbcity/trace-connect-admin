import {
  User,
  UserResetPasswordCommand,
  UserUpdatedEmailEvent,
  UserUpdateEmailCommand,
  UserUpdatePasswordCommand,
  UserUpdatePasswordResult
} from '../Domain'
import { CommandParams, QueryParams, request, useCommandRequest, useQueryRequest } from '@smartb/g2-utils'
import { useAuthenticatedRequest } from '@smartb/g2-providers'

export const useGetUsers = <T extends User = User>(params: QueryParams<{id: string}, {items: T[], total: number}>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useQueryRequest<{id: string}, {items: T[], total: number}>(
    "userPage", requestProps, params
  )
}

export const useGetUser = <T extends User = User>(params: QueryParams<{id: string}, {item: T}>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useQueryRequest<{id: string}, {item: T}>(
    "userGet", requestProps, params
  )
}

export const useUpdateUser = <T extends User = User>(params?: CommandParams<T, { id: string }>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<T, { id: string }>(
    "userUpdate", requestProps, params
  )
}

export const useCreateUser = <T extends User = User>(params?: CommandParams<T, { id: string }>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<T, { id: string }>(
    "userCreate", requestProps, params
  )
}

export const useUserUpdatePassword = (params?: CommandParams<UserUpdatePasswordCommand, UserUpdatePasswordResult>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<UserUpdatePasswordCommand, UserUpdatePasswordResult>(
    "userUpdatePassword", requestProps, params
  )
}

export const useUserResetPassword = (params?: CommandParams<UserResetPasswordCommand, UserUpdatePasswordResult>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<UserResetPasswordCommand, UserUpdatePasswordResult>(
    "userResetPassword", requestProps, params
  )
}

export const useUserUpdateEmail = (params?: CommandParams<UserUpdateEmailCommand, UserUpdatedEmailEvent>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<UserUpdateEmailCommand, UserUpdatedEmailEvent>(
    "userUpdateEmail", requestProps, params
  )
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
