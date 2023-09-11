import {QueryParams, useQueryRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../config";
import { city } from "@smartb/apikey-domain"

export interface ApiKeyPageQuery extends city.smartb.im.apikey.domain.query.ApiKeyPageQueryDTO {}

export interface ApiKeyPageResult extends city.smartb.im.apikey.domain.query.ApiKeyPageResultDTO {}

export const useApiKeyPageQueryFunction = (params: QueryParams<ApiKeyPageQuery, ApiKeyPageResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyPageQuery, ApiKeyPageResult>(
      "apiKeyPage", requestProps, params
    )
}
