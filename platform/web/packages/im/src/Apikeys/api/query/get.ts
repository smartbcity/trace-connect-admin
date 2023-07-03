import {OrganizationId, QueryParams, useQueryRequest} from "@smartb/g2";
import {ApiKeyDTO, ApiKeyId} from "../model";
import {useAuthenticatedRequest} from "../../config";


export interface ApiKeyGetQuery {
    id: ApiKeyId,
    /**
     * Identifier of the organizationId.
     */
    organizationId: OrganizationId
}

export interface ApiKeyGetResult {
    item?: ApiKeyDTO
}

export const useApiKeyGetQuery = (params: QueryParams<ApiKeyGetQuery, ApiKeyGetResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyGetQuery, ApiKeyGetResult>(
      "apiKeyGet", requestProps, params
    )
}
