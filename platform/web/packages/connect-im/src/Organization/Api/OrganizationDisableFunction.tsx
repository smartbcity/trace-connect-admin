import { OrganizationId } from '../Domain'
import {
  CommandParams,
  request,
  RequestProps,
  useCommandRequest
} from '@smartb/g2-utils'
import { useCallback } from 'react'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'

export interface OrganizationDisableCommand {
  id: OrganizationId
  disabledBy?: string
  anonymize: Boolean
  attributes?: Record<string, string>
  userAttributes?: Record<string, string>
}

export interface OrganizationDisabledEvent {
  id: OrganizationId
  userIds: string[]
}

export const useOrganizationDisable = (
  props: RequestProps,
  params: CommandParams<OrganizationDisableCommand, OrganizationDisabledEvent>
) => {
  return useCommandRequest<
    OrganizationDisableCommand,
    OrganizationDisabledEvent
  >('organizationDisable', props, params)
}

export type OrganizationDisableOptions = Omit<
  UseMutationOptions<
    undefined | { id: string },
    unknown,
    OrganizationDisableCommand,
    unknown
  >,
  'mutationFn'
>

export interface OrganizationDisableParams {
  jwt?: string
  apiUrl: string
  options?: OrganizationDisableOptions
}

export const useOrganizationDisable2 = (params: OrganizationDisableParams) => {
  const { apiUrl, jwt, options } = params
  // TODO Remove all duplicated code with other request
  const organizationDisable = useCallback(
    async (cmd: OrganizationDisableCommand) => {
      const res = await request<OrganizationDisabledEvent[]>({
        url: `${apiUrl}/organizationDisable`,
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

  return useMutation(organizationDisable, options)
}
