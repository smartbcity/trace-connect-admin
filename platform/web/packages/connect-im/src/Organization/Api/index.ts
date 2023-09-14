import {
  Organization,
  OrganizationId,
} from '../Domain'
import { CommandParams, CommandWithFile, QueryParams, request, useCommandRequest, useCommandWithFileRequest, useQueryRequest } from '@smartb/g2-utils'
import { useAuthenticatedRequest } from '@smartb/g2-providers'
export * from './GetOrganizationRefsQuery'

export const useGetOrganizations = <T extends Organization = Organization>(params: QueryParams<{id: OrganizationId}, {items: T[], total: number}>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useQueryRequest<{id: OrganizationId}, {items: T[], total: number}>(
    "organizationPage", requestProps, params
  )
}

export const useGetOrganization = <T extends Organization = Organization>(params: QueryParams<{id: OrganizationId}, {item: T}>) => {
    const requestProps = useAuthenticatedRequest("im")
    return useQueryRequest<{id: OrganizationId}, {item: T}>(
      "organizationGet", requestProps, params
    )
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


export const useUpdateOrganization = <T extends Organization = Organization>(params?: CommandParams<T, {id: OrganizationId}>) => {
    const requestProps = useAuthenticatedRequest("im")
    return useCommandRequest<T, {id: OrganizationId}>(
        "organizationUpdate", requestProps, params
    )
}

export const useCreateOrganization = <T extends Organization = Organization>(params?: CommandParams<T, {id: OrganizationId}>) => {
    const requestProps = useAuthenticatedRequest("im")
    return useCommandRequest<T, {id: OrganizationId}>(
        "organizationCreate", requestProps, params
    )
}

export const useOrganizationUploadLogo = (params?: CommandParams<CommandWithFile<{id: OrganizationId}>, {id: OrganizationId}>) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandWithFileRequest<{id: OrganizationId}, {id: OrganizationId}>(
    "organizationUploadLogo", requestProps, params
  )
}

export * from './GetOrganizationRefsQuery'
export * from './OrganizationDisableFunction'
