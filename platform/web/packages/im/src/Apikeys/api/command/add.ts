import {CommandParams, OrganizationId, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../config";
import { city } from "@smartb/apikey-domain"

interface ApiKeyAddCommandDTO extends city.smartb.im.apikey.domain.features.command.ApiKeyOrganizationAddCommandDTO {
    role: string
}

interface ApiKeyAddedEventDTO {
    /**
     * Id of the new key.
     */
    id: string,

    /**
     * Id of the organization.
     */
    organizationId: OrganizationId,

    /**
     * Identifier of the new key.
     */
    keyIdentifier: string,

    /**
     * Secret of the new key.
     */
    keySecret: string
}


export interface ApiKeyAddCommand extends ApiKeyAddCommandDTO{ }
export interface ApiKeyAddedEvent extends  ApiKeyAddedEventDTO{ }

export type ApiKeyAddFunctionOptions = Omit<CommandParams<ApiKeyAddCommand, ApiKeyAddedEvent>,
    'jwt' | 'apiUrl'
>

export const useApiKeyAddFunction = (params?: ApiKeyAddFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<ApiKeyAddCommand, ApiKeyAddedEvent>(
        "apiKeyCreate", requestProps, params
    )
}
