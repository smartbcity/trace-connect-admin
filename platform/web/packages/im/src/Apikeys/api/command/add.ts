import {CommandParams, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../config";
import { city } from "@smartb/apikey-domain"

export interface ApiKeyAddCommand extends city.smartb.im.apikey.domain.command.ApiKeyOrganizationAddCommandDTO {}

export interface ApiKeyAddedEvent extends city.smartb.im.apikey.domain.command.ApiKeyAddedEventDTO {}

export type ApiKeyAddFunctionOptions = Omit<CommandParams<ApiKeyAddCommand, ApiKeyAddedEvent>,
    'jwt' | 'apiUrl'
>

export const useApiKeyAddFunction = (params?: ApiKeyAddFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<ApiKeyAddCommand, ApiKeyAddedEvent>(
        "apiKeyCreate", requestProps, params
    )
}
