import {OrganizationId, QueryParams, useQueryRequest} from "@smartb/g2";
import {ApiKeyDTO} from "../model";
import {useAuthenticatedRequest} from "../../config";

export interface ApiKeyPageQuery {
    organizationId?: OrganizationId
}

export interface ApiKeyPageResult {
    items: ApiKeyDTO[],
    total: number
}

export const useApiKeyPageQueryFunction = (params: QueryParams<ApiKeyPageQuery, ApiKeyPageResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyPageQuery, ApiKeyPageResult>(
      "apiKeyPage", requestProps, params
    )
}
