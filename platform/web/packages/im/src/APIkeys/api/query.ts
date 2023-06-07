import {CommandParams, OrganizationId, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../config";


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


interface ApiKeyDTO {
    id: string
    name: string
    identifier: string
    creationDate: number
}
export interface APIKeyDTO extends ApiKeyDTO{ }


export interface APIKeyAddCommand extends OrganizationAddApiKeyCommandDTO{ }
export interface APIKeyEventDTO extends  OrganizationAddedApiKeyEventDTO{ }

export type OrganizationAddAPIKeyFunctionOptions = Omit<CommandParams<APIKeyAddCommand, APIKeyEventDTO>,
    'jwt' | 'apiUrl'
>

export const useOrganizationAddAPIKeyFunction = (params?: OrganizationAddAPIKeyFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<APIKeyAddCommand, APIKeyEventDTO>(
        "organizationAddApiKey", requestProps, params
    )
}