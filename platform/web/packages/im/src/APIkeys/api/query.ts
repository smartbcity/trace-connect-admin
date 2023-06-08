import {CommandParams, OrganizationId, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../config";
import {Organization} from "@smartb/g2-i2-v2";

interface OrganizationAddApiKeyCommandDTO {
    /**
     * Id of the organization.
     */
    id: OrganizationId

    /**
     * Name of the key.
     */
    name: string
}

interface OrganizationAddedApiKeyEventDTO {
        /**
         * Id of the organization.
         */
    id: OrganizationId,

        /**
         * Id of the new key.
         */
    keyId: string,

        /**
         * Identifier of the new key.
         */
    keyIdentifier: string,

        /**
         * Secret of the new key.
         */
    keySecret: string
}

interface OrganizationRemoveApiKeyCommandDTO {
    id: OrganizationId
    keyId: String
}

interface ApiKeyDTO {
    id: string
    name: string
    identifier: string
    creationDate: number
}

export interface OrganizationDTO extends Organization{
    apiKeys: ApiKeyDTO[]
}
export interface APIKeyDTO extends ApiKeyDTO{ }
export interface OrganizationRemoveApiKeyCommand extends OrganizationRemoveApiKeyCommandDTO{ }



export interface OrganizationAddApiKeyCommand extends OrganizationAddApiKeyCommandDTO{ }
export interface OrganizationAddedApiKeyEvent extends  OrganizationAddedApiKeyEventDTO{ }

export type OrganizationAddAPIKeyFunctionOptions = Omit<CommandParams<OrganizationAddApiKeyCommand, OrganizationAddedApiKeyEvent>,
    'jwt' | 'apiUrl'
>

export const useOrganizationAddAPIKeyFunction = (params?: OrganizationAddAPIKeyFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<OrganizationAddApiKeyCommand, OrganizationAddedApiKeyEvent>(
        "organizationAddApiKey", requestProps, params
    )
}

export type OrganizationRemoveAPIKeyFunctionOptions = Omit<CommandParams<OrganizationRemoveApiKeyCommand, OrganizationAddedApiKeyEvent>,
    'jwt' | 'apiUrl'
>
export const useOrganizationRemoveAPIKeyFunction = (params?: OrganizationRemoveAPIKeyFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<OrganizationRemoveApiKeyCommand, OrganizationAddedApiKeyEvent>(
        "organizationRemoveApiKey", requestProps, params
    )
}