import { i2Config, useAuth } from '@smartb/g2-providers'
import { useCallback, useMemo } from 'react'
import {
  FlatOrganization,
  flatOrganizationToOrganization,
  Organization,
  organizationToFlatOrganization
} from '../../Domain'
import { useQueryClient } from '@tanstack/react-query'
import {
  CreateOrganizationOptions,
  GetOrganizationOptions,
  OrganizationUploadLogoOptions,
  UpdateOrganizationOptions,
  getInseeOrganization,
  useCreateOrganization,
  useGetOrganization,
  useOrganizationUploadLogo,
  useUpdateOrganization
} from '../../Api'
import { FormikFormParams, useFormComposable } from '@smartb/g2-composable'

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
  getOrganizationOptions?: GetOrganizationOptions<T>
  /**
   * The updateOrganization hook options
   */
  updateOrganizationOptions?: UpdateOrganizationOptions<T>
  /**
   * The uploadLogo hook options
   */
  uploadLogoOptions?: OrganizationUploadLogoOptions
  /**
   * The createOrganization hook options
   */
  createOrganizationOptions?: CreateOrganizationOptions<T>
  /**
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
    apiUrl: i2Config().orgUrl,
    organizationId: myOrganization ? user?.memberOf : organizationId,
    jwt: keycloak.token,
    options: getOrganizationOptions
  })

  const organization = useMemo(
    () => getOrganization.data?.item,
    [getOrganization.data?.item]
  )

  console.log(organization)

  const updateOrganizationOptionsMemo = useMemo(
    () => ({
      ...updateOrganizationOptions,
      //@ts-ignore
      onSuccess: (data, variables, context) => {
        getOrganization.refetch()
        queryClient.invalidateQueries({ queryKey: ['organizationRefs'] })
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
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
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
        createOrganizationOptions?.onSuccess &&
          createOrganizationOptions.onSuccess(data, variables, context)
      }
    }),
    [createOrganizationOptions, queryClient.invalidateQueries]
  )

  const updateOrganization = useUpdateOrganization({
    apiUrl: i2Config().orgUrl,
    jwt: keycloak.token,
    options: updateOrganizationOptionsMemo
  })

  const uploadLogo = useOrganizationUploadLogo({
    apiUrl: i2Config().orgUrl,
    jwt: keycloak.token,
    options: uploadLogoOptions
  })

  const createOrganization = useCreateOrganization({
    apiUrl: i2Config().orgUrl,
    jwt: keycloak.token,
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

  console.log(formState.values)

  const getInseeOrganizationMemoized = useCallback(
    async (siret: string) => {
      return getInseeOrganization(siret, i2Config().orgUrl, keycloak.token)
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
