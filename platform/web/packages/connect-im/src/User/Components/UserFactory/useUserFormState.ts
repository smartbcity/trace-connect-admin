import { FormikFormParams, useFormComposable } from '@smartb/g2-composable'
import { i2Config, useAuth } from '@smartb/g2-providers'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OrganizationId } from '../../../Organization'
import {
  CreateUserOptions,
  GetUsersOptions,
  UpdateUserOptions,
  useCreateUser,
  useGetUser,
  userExistsByEmail,
  UserUpdateEmailOptions,
  useUpdateUser,
  useUserUpdateEmail
} from '../../Api'
import { FlatUser, flatUserToUser, User, userToFlatUser } from '../../Domain'

export interface UseUserFormStateProps<T extends User = User> {
  /**
   * The getUser hook options
   */
  getUserOptions?: GetUsersOptions<T>
  /**
   * The updateUser hook options
   */
  updateUserOptions?: UpdateUserOptions<T>
  /**
   * The createUser hook options
   */
  createUserOptions?: CreateUserOptions<T>
  /**
   * The userUpdateEmail hook options
   */
  userUpdateEmailOptions?: UserUpdateEmailOptions
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
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token,
    userId: myProfile && keycloakUser ? keycloakUser.id : userId,
    //@ts-ignore
    options: getUserOptions
  })

  const user = useMemo(() => getUser.data, [getUser.data])

  const updateUserOptionsMemo = useMemo(
    () => ({
      ...updateUserOptions,
      //@ts-ignore
      onSuccess: (data, variables, context) => {
        getUser.refetch()
        queryClient.invalidateQueries({ queryKey: ['users'] })
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
        queryClient.invalidateQueries({ queryKey: ['users'] })
        createUserOptions?.onSuccess &&
          createUserOptions.onSuccess(data, variables, context)
      }
    }),
    [createUserOptions, queryClient.invalidateQueries]
  )

  const updateUser = useUpdateUser({
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token,
    options: updateUserOptionsMemo
  })

  const createUser = useCreateUser({
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token,
    options: createUserOptionsMemo,
    organizationId: organizationId
  })

  const updateEmail = useUserUpdateEmail({
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token,
    options: userUpdateEmailOptions
  })

  const updateUserMemoized = useCallback(
    async (user: T) => {
      const results: Promise<any>[] = []
      results.push(updateUser.mutateAsync({ ...user }))
      if (getUser.data?.email !== user.email) {
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
    [updateUser.mutateAsync, updateEmail.mutateAsync, getUser.data?.email]
  )

  const createUserMemoized = useCallback(
    async (user: T) => {
      const res = await createUser.mutateAsync({ ...user })
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
      return userExistsByEmail(email, i2Config().userUrl, keycloak.token)
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

  const initialValues = useMemo(
    () => ({
      //@ts-ignore
      memberOf: organizationId,
      sendVerifyEmail: true,
      sendResetPassword: true,
      //@ts-ignore
      ...(!!user ? userToFlatUser(user) : undefined),
      roles: multipleRoles
        ? user?.roles || defaultRoles
        : // @ts-ignore
        user?.roles && user?.roles?.length > 0
        ? user?.roles[0]
        : defaultRoles[0],
      ...(extendInitialValues && user ? extendInitialValues(user) : undefined)
    }),
    [user, multipleRoles, defaultRoles, extendInitialValues]
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
