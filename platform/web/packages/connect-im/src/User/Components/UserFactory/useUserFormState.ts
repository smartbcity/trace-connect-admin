import { FormikFormParams, useFormComposable } from '@smartb/g2-composable'
import { i2Config, useAuth } from '@smartb/g2-providers'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OrganizationId } from '../../../Organization'
import {
  useCreateUser,
  useGetUser,
  userExistsByEmail,
  useUpdateUser,
  useUserUpdateEmail
} from '../../Api'
import { FlatUser, flatUserToUser, User, userToFlatUser, UserUpdatedEmailEvent, UserUpdateEmailCommand } from '../../Domain'
import { CommandOptions, QueryOptions } from '@smartb/g2-utils'

export interface UseUserFormStateProps<T extends User = User> {
  /**
   * The getUser hook options
   */
  getUserOptions?: QueryOptions<{id: string}, {item: T}>
  /**
   * The updateUser hook options
   */
  updateUserOptions?: CommandOptions<T, { id: string }>
  /**
   * The createUser hook options
   */
  createUserOptions?: CommandOptions<T, { id: string }>
  /**
   * The userUpdateEmail hook options
   */
  userUpdateEmailOptions?: CommandOptions<UserUpdateEmailCommand, UserUpdatedEmailEvent>
  /**
   * The organizationId of the user.⚠️ You have to provide it if `update` is false and the organization module is activated
   */
  organizationId?: OrganizationId
  /**
   * Define whether the object is updated or created
   * @default false
   */
  update?: boolean
  /**
   * The user id to provide if it's an updation
   */
  userId?: string
  /**
   * Allow the user to have multipe roles
   *
   * @default true
   */
  multipleRoles?: boolean
  /**
   * to use the current user
   * @default  false
   */
  myProfile?: boolean
  /**
   * The roles used by default in the form
   */
  defaultRoles?: string[]
  /**
   * use this param to access the formComposable config
   */
  formComposableParams?: Partial<FormikFormParams<any>>
  /**
   * provide this function to extend the initialValues passes to the formComposable
   */
  extendInitialValues?: (user: T) => any
}

export const useUserFormState = <T extends User = User>(
  params?: UseUserFormStateProps<T>
) => {
  const {
    multipleRoles = true,
    organizationId,
    defaultRoles = [],
    createUserOptions,
    getUserOptions,
    updateUserOptions,
    userUpdateEmailOptions,
    update = false,
    myProfile = false,
    userId,
    formComposableParams,
    extendInitialValues
  } = params ?? {}

  const { keycloak, service } = useAuth()
  const queryClient = useQueryClient()

  const keycloakUser = useMemo(() => {
    return service.getUser()
  }, [service.getUser])

  const getUser = useGetUser<T>({
    query: {
      id:( myProfile && keycloakUser ? keycloakUser.id : userId) ?? ""
    },
    options: getUserOptions
  })

  const user = useMemo(() => getUser.data?.item, [getUser.data])

  const updateUserOptionsMemo = useMemo(
    () => ({
      ...updateUserOptions,
      //@ts-ignore
      onSuccess: (data, variables, context) => {
        getUser.refetch()
        queryClient.invalidateQueries({ queryKey: ['userPage'] })
        updateUserOptions?.onSuccess &&
          updateUserOptions.onSuccess(data, variables, context)
      }
    }),
    [updateUserOptions, getUser, queryClient.invalidateQueries]
  )

  const createUserOptionsMemo = useMemo(
    () => ({
      ...createUserOptions,
      //@ts-ignore
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['userPage'] })
        createUserOptions?.onSuccess &&
          createUserOptions.onSuccess(data, variables, context)
      }
    }),
    [createUserOptions, queryClient.invalidateQueries]
  )

  const updateUser = useUpdateUser({
    options: updateUserOptionsMemo
  })

  const createUser = useCreateUser({
    options: createUserOptionsMemo
  })

  const updateEmail = useUserUpdateEmail({
    options: userUpdateEmailOptions
  })

  const updateUserMemoized = useCallback(
    async (user: User) => {
      const results: Promise<any>[] = []
      //@ts-ignore
      results.push(updateUser.mutateAsync({ ...user, memberOf: user.memberOf?.id }))
      if (getUser.data?.item.email !== user.email) {
        results.push(
          updateEmail.mutateAsync({
            email: user.email,
            id: user.id
          })
        )
      }
      const res = await Promise.all(results)
      for (let it in res) {
        const result = res[it]
        if (!result) return false
      }
      return true
    },
    [updateUser.mutateAsync, updateEmail.mutateAsync, getUser.data?.item.email]
  )

  const createUserMemoized = useCallback(
    async (user: User) => {
      //@ts-ignore
      const res = await createUser.mutateAsync({ ...user, memberOf: user.memberOf?.id ?? organizationId })
      if (res) {
        return true
      } else {
        return false
      }
    },
    [createUser.mutateAsync]
  )

  const checkEmailValidity = useCallback(
    async (email: string) => {
      return userExistsByEmail(email, i2Config().url, keycloak.token)
    },
    [keycloak.token]
  )

  const onSubmitMemoized = useCallback(
    async (values: FlatUser) => {
      const onSubmit = update ? updateUserMemoized : createUserMemoized
      if (onSubmit) {
        await onSubmit({
          ...values,
          ...flatUserToUser(values, multipleRoles),
          id: user?.id ?? '',
          phone: values.phone?.replaceAll(' ', '')
        } as T)
      }
    },
    [user, multipleRoles, update, updateUserMemoized, createUserMemoized]
  )

  const initialRoles = useMemo(() => {
    const roles = user?.roles.map((role) => role.identifier) ?? defaultRoles
    return multipleRoles ? roles : roles?.[0]
  }, [defaultRoles, user?.roles, multipleRoles])

  const initialValues = useMemo(
    () => ({
      //@ts-ignore
      memberOf: organizationId,
      sendVerifyEmail: true,
      sendResetPassword: true,
      //@ts-ignore
      ...(!!user ? userToFlatUser(user) : undefined),
      roles: initialRoles,
      ...(extendInitialValues && user ? extendInitialValues(user) : undefined)
    }),
    [user, multipleRoles, initialRoles, extendInitialValues]
  )

  const formState = useFormComposable({
    ...formComposableParams,
    onSubmit: onSubmitMemoized,
    formikConfig: {
      initialValues: initialValues
    }
  })

  return {
    formState,
    checkEmailValidity,
    user: user,
    isLoading: getUser.isInitialLoading,
    getUser: getUser
  }
}
