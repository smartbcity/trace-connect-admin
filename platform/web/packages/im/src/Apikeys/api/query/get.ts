import { QueryParams, useQueryRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../config";
import { city } from "@smartb/apikey-domain"

export interface ApiKeyGetQuery extends city.smartb.im.apikey.domain.query.ApiKeyGetQueryDTO {}

export interface ApiKeyGetResult extends city.smartb.im.apikey.domain.query.ApiKeyGetResultDTO {}


export const useApiKeyGetQuery = (params: QueryParams<ApiKeyGetQuery, ApiKeyGetResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyGetQuery, ApiKeyGetResult>(
      "apiKeyGet", requestProps, params
    )
}
