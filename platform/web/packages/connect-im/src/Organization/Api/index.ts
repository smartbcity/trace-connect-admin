import {
  Organization,
  OrganizationCreateCommand,
  OrganizationGetQuery,
  OrganizationGetResult,
  OrganizationId,
  OrganizationPageResult,
  OrganizationUpdateCommand
} from '../Domain'
import { useCallback } from 'react'
import { request } from '@smartb/g2-utils'
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  QueryFunctionContext
} from '@tanstack/react-query'
export * from './GetOrganizationRefsQuery'

export type GetOrganizationsOptions<T extends Organization> = Omit<
  UseQueryOptions<
    OrganizationPageResult<T>,
    unknown,
    OrganizationPageResult<T>,
    any[]
  >,
  'queryKey' | 'queryFn'
>

export interface GetOrganizationsParams<T extends Organization = Organization> {
  /**
   * @default "organization"
   */
  queryKey?: string
  jwt?: string
  apiUrl: string
  options?: GetOrganizationsOptions<T>
  queryParams?: object
}

export const useGetOrganizations = <T extends Organization = Organization>(
  params: GetOrganizationsParams<T>
) => {
  const {
    apiUrl,
    jwt,
    options,
    queryKey = 'organizations',
    queryParams
  } = params
  // TODO Remove all duplicated code with other request
  const getOrganizations = useCallback(
    async ({
      queryKey
    }: QueryFunctionContext<[string, any | undefined]>): Promise<
      OrganizationPageResult<T>
    > => {
      const [_key, currentParams] = queryKey
      const res = await request<OrganizationPageResult<T>[]>({
        url: `${apiUrl}/organizationPage`,
        method: 'POST',
        body: JSON.stringify({
          ...currentParams,
          size: currentParams?.size ?? 10
        }),
        jwt: jwt
      })
      if (res) {
        return {
          items: res[0]?.items,
          total: res[0]?.total ? Math.ceil(res[0]?.total / 10) : 0
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
  return useQuery([queryKey, queryParams], getOrganizations, options)
}

export type GetOrganizationOptions<T extends Organization = Organization> =
  Omit<
    UseQueryOptions<
      OrganizationGetResult<T> | null,
      unknown,
      OrganizationGetResult<T> | null,
      (string | undefined)[]
    >,
    'queryKey' | 'queryFn'
  >

export interface GetOrganizationParams<T extends Organization> {
  /**
   * @default "organization"
   */
  queryKey?: string
  jwt?: string
  organizationId?: OrganizationId
  apiUrl: string
  options?: GetOrganizationOptions<T>
}

export const useGetOrganization = <T extends Organization = Organization>(
  params: GetOrganizationParams<T>
) => {
  const {
    apiUrl,
    jwt,
    options,
    organizationId,
    queryKey = 'organization'
  } = params
  // TODO Remove all duplicated code with other request
  const getOrganization = useCallback(
    async ({ queryKey }: QueryFunctionContext<[string, string]>) => {
      const [_key, organizationId] = queryKey
      const res = await request<OrganizationGetResult<T>[]>({
        url: `${apiUrl}/organizationGet`,
        method: 'POST',
        body: JSON.stringify({
          id: organizationId
        } as OrganizationGetQuery),
        jwt: jwt
      })
      if (res) {
        return res[0]
      } else {
        return null
      }
    },
    [apiUrl, jwt]
  )

    //@ts-ignore
  return useQuery([queryKey, organizationId], getOrganization, {
    enabled: !!organizationId,
    ...options
  })
}

export const getInseeOrganization = async <
  T extends Organization = Organization
>(
  siret: string,
  apiUrl: string,
  jwt?: string
) => {
  const res = await request<{ item?: T }[]>({
    url: `${apiUrl}/organizationGetFromInsee`,
    method: 'POST',
    body: JSON.stringify({
      siret: siret
    }),
    jwt: jwt
  })
  if (res) {
    return res[0].item
  } else {
    return null
  }
}

export type UpdateOrganizationOptions<T extends Organization = Organization> =
  Omit<
    UseMutationOptions<undefined | { id: string }, unknown, T, unknown>,
    'mutationFn'
  >

export interface UpdateOrganizationParams<T extends Organization> {
  jwt?: string
  apiUrl: string
  options?: UpdateOrganizationOptions<T>
}

export const useUpdateOrganization = <T extends Organization = Organization>(
  params: UpdateOrganizationParams<T>
) => {
  const { apiUrl, jwt, options } = params
  // TODO Remove all duplicated code with other request
  const updateOrganization = useCallback(
    async (organization: T) => {
      const res = await request<{ id: string }[]>({
        url: `${apiUrl}/organizationUpdate`,
        method: 'POST',
        body: JSON.stringify({
          ...organization
        } as OrganizationUpdateCommand),
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

  return useMutation(updateOrganization, options)
}

export type CreateOrganizationOptions<T extends Organization = Organization> =
  Omit<
    UseMutationOptions<undefined | { id: string }, unknown, T, unknown>,
    'mutationFn'
  >

export interface CreateOrganizationParams<T extends Organization> {
  jwt?: string
  apiUrl: string
  options?: CreateOrganizationOptions<T>
}

export const useCreateOrganization = <T extends Organization = Organization>(
  params: CreateOrganizationParams<T>
) => {
  const { apiUrl, jwt, options } = params
  // TODO Remove all duplicated code with other request
  const createOrganization = useCallback(
    async (organization: T) => {
      const res = await request<{ id: string }[]>({
        url: `${apiUrl}/organizationCreate`,
        method: 'POST',
        body: JSON.stringify({
          ...organization
        } as OrganizationCreateCommand),
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

  return useMutation(createOrganization, options)
}

export type OrganizationUploadLogoOptions = Omit<
  UseMutationOptions<
    undefined | { id: string },
    unknown,
    { id: string; file: File },
    unknown
  >,
  'mutationFn'
>

export interface OrganizationUploadLogoParams {
  jwt?: string
  apiUrl: string
  options?: OrganizationUploadLogoOptions
}

export const useOrganizationUploadLogo = (
  params: OrganizationUploadLogoParams
) => {
  const { apiUrl, jwt, options } = params
  // TODO Remove all duplicated code with other request
  const updateOrganization = useCallback(
    async (params: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append(
        'command',
        new Blob([JSON.stringify({ id: params.id })], {
          type: 'application/json'
        })
      )
      formData.append('file', params.file)
      const res = await request<{ id: string }[]>({
        url: `${apiUrl}/organizationUploadLogo`,
        method: 'POST',
        formData: formData,
        contentType: 'none',
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

  return useMutation(updateOrganization, options)
}

export * from './GetOrganizationRefsQuery'
export * from './OrganizationDisableFunction'
