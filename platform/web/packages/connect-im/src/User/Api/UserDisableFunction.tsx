import { useAuthenticatedRequest } from '@smartb/g2-providers'
import { UserId } from '../Domain'
import {
  CommandParams,
  useCommandRequest
} from '@smartb/g2-utils'

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
  params: CommandParams<UserDisableCommand, UserDisabledEvent>
) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<UserDisableCommand, UserDisabledEvent>(
    'userDisable',
    requestProps,
    params
  )
}
