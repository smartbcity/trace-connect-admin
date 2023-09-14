import { i2Config, useAuth } from '@smartb/g2-providers'
import { useCallback, useMemo } from 'react'
import {
  FlatOrganization,
  flatOrganizationToOrganization,
  Organization,
  OrganizationId,
  organizationToFlatOrganization
} from '../../Domain'
import { useQueryClient } from '@tanstack/react-query'
import {
  getInseeOrganization,
  useCreateOrganization,
  useGetOrganization,
  useOrganizationUploadLogo,
  useUpdateOrganization
} from '../../Api'
import { FormikFormParams, useFormComposable } from '@smartb/g2-composable'
import { CommandOptions, CommandWithFile, QueryOptions } from '@smartb/g2-utils'

export interface useOrganizationFormStateProps<
  T extends Organization = Organization
> {
  /**
   * The organization id to provide if it's an updation
   */
  organizationId?: string
  /**
   * The getOrganization hook options
   */
  getOrganizationOptions?: QueryOptions<{id: OrganizationId}, {item: T}>
  /**
   * The updateOrganization hook options
   */
  updateOrganizationOptions?: CommandOptions<T, {id: OrganizationId}>
  /**
   * The uploadLogo hook options
   */
  uploadLogoOptions?: CommandOptions<CommandWithFile<{id: OrganizationId}>, {id: OrganizationId}>
  /**
   * The createOrganization hook options
   */
  createOrganizationOptions?: CommandOptions<T, {id: OrganizationId}>
  /**a
   * Define whether the object is updated or created
   * @default false
   */
  update?: boolean
  /**
   * The roles used to attributs the default roles
   */
  defaultRoles?: string[]
  /**
   * to use the current user organization
   * @default  false
   */
  myOrganization?: boolean
  /**
   * Allow the organization to have multipe roles
   *
   * @default true
   */
  multipleRoles?: boolean
  /**
   * use this param to access the formComposable config
   */
  formComposableParams?: Partial<FormikFormParams<any>>
  /**
   * provide this function to extend the initialValues passes to the formComposable
   */
  extendInitialValues?: (organization: T) => any
}

export const useOrganizationFormState = <T extends Organization = Organization>(
  params?: useOrganizationFormStateProps<T>
) => {
  const {
    createOrganizationOptions,
    getOrganizationOptions,
    organizationId,
    update,
    updateOrganizationOptions,
    defaultRoles,
    multipleRoles = true,
    myOrganization = false,
    uploadLogoOptions,
    formComposableParams,
    extendInitialValues
  } = params ?? {}

  const { keycloak, service } = useAuth()
  const queryClient = useQueryClient()

  const user = useMemo(() => {
    return service.getUser()
  }, [service.getUser])

  const getOrganization = useGetOrganization<T>({
    query: {
      id: (myOrganization ? user?.memberOf : organizationId) ?? ""
    },
    options: {
      ...getOrganizationOptions,
      enabled: !!organizationId
    }
  })

  const organization = useMemo(
    () => getOrganization.data?.item,
    [getOrganization.data?.item]
  )

  const updateOrganizationOptionsMemo = useMemo(
    () => ({
      ...updateOrganizationOptions,
      //@ts-ignore
      onSuccess: (data, variables, context) => {
        getOrganization.refetch()
        queryClient.invalidateQueries({ queryKey: ['organizationRefs'] })
        queryClient.invalidateQueries({ queryKey: ['organizationPage'] })
        updateOrganizationOptions?.onSuccess &&
          updateOrganizationOptions.onSuccess(data, variables, context)
      }
    }),
    [updateOrganizationOptions, getOrganization, queryClient.invalidateQueries]
  )

  const createOrganizationOptionsMemo = useMemo(
    () => ({
      ...createOrganizationOptions,
      //@ts-ignore
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['organizationRefs'] })
        queryClient.invalidateQueries({ queryKey: ['organizationPage'] })
        createOrganizationOptions?.onSuccess &&
          createOrganizationOptions.onSuccess(data, variables, context)
      }
    }),
    [createOrganizationOptions, queryClient.invalidateQueries]
  )

  const updateOrganization = useUpdateOrganization({
    options: updateOrganizationOptionsMemo
  })

  const uploadLogo = useOrganizationUploadLogo({
    options: uploadLogoOptions
  })

  const createOrganization = useCreateOrganization({
    options: createOrganizationOptionsMemo
  })

  const updateOrganizationMemoized = useCallback(
    async (organization: T) => {
      organization.logo &&
        (await uploadLogo.mutateAsync({
          //@ts-ignore
          file: organization.logo,
          id: organization.id
        }))
        //@ts-ignore
      delete organization.logo
      await updateOrganization.mutateAsync(organization)
    },
    [updateOrganization.mutateAsync, uploadLogo.mutateAsync]
  )

  const createOrganizationMemoized = useCallback(
    async (organization: T) => {
      await createOrganization.mutateAsync(organization)
    },
    [createOrganization.mutateAsync]
  )

  const onSubmitMemoized = useCallback(
    async (values: FlatOrganization) => {
      const onSubmit = update
        ? updateOrganizationMemoized
        : createOrganizationMemoized
        //@ts-ignore
      await onSubmit({
        ...values,
        ...flatOrganizationToOrganization(values, multipleRoles),
        id: organization?.id ?? ''
      })
    },
    [
      organization,
      multipleRoles,
      update,
      updateOrganizationMemoized,
      createOrganizationMemoized
    ]
  )

  const initialRoles = useMemo(() => {
    const roles = organization?.roles.map((role) => role.identifier) ?? defaultRoles
    return multipleRoles ? roles : roles?.[0]
  }, [defaultRoles, organization?.roles, multipleRoles])

  const initialValues = useMemo(
    () => ({
      ...(!!organization
        ? //@ts-ignore
          organizationToFlatOrganization(organization)
        : undefined),
      //@ts-ignore
      roles: initialRoles,
      ...(extendInitialValues && organization
        ? extendInitialValues(organization)
        : undefined)
    }),
    [initialRoles, organization, extendInitialValues]
  )

  const formState = useFormComposable({
    ...formComposableParams,
    onSubmit: onSubmitMemoized,
    formikConfig: {
      initialValues: initialValues
    }
  })

  const getInseeOrganizationMemoized = useCallback(
    async (siret: string) => {
      return getInseeOrganization(siret, i2Config().url, keycloak.token)
    },
    [keycloak.token]
  )

  return {
    formState,
    organization: organization,
    isLoading: getOrganization.isInitialLoading,
    getOrganization: getOrganization,
    getInseeOrganization: getInseeOrganizationMemoized
  }
}
