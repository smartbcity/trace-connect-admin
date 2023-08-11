import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {LinkButton, Page} from "@smartb/g2";
import {useCallback, useMemo} from "react";
import {Offset, OffsetPagination, PageQueryResult} from "template";
import {PageHeaderObject, useExtendedAuth, useRoutesDefinition} from "components";
import {ApiKeyDTO, useApiKeyPageQueryFunction, useApikeyRemoveFunction} from "../../api";
import {APIKeysTable} from "../../components";
import { useGetOrganizationRefs } from "@smartb/g2-i2-v2";
import { useApiKeysFilters } from "./useApiKeysFilters";
import { usePolicies } from "../../../Policies/usePolicies";

interface APIKeysListPageProps {
}
export const ApikeyListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();
    const { service, keycloak} = useExtendedAuth()
    const organizationId = service.getUser()?.memberOf
    const { apiKeysAdd } = useRoutesDefinition()
    const policies = usePolicies()

    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })

    const {component, submittedFilters, setOffset} = useApiKeysFilters({orgRef: getOrganizationRefs.query.data?.items, canFilterOrg: policies.apiKeys.canfilter})

    const pagination = useMemo((): OffsetPagination => ({ offset: submittedFilters.offset ?? Offset.default.offset, limit: submittedFilters.limit ?? Offset.default.limit }), [submittedFilters.offset, submittedFilters.limit])
    const apiKeyPageQuery = useApiKeyPageQueryFunction({
        query: {
            ...submittedFilters,
            organizationId: !policies.apiKeys.canfilter ? organizationId : submittedFilters.organizationId
        }
    })
    const apiKeysPage : PageQueryResult<ApiKeyDTO> = useMemo(() => {
        const apiKeys = apiKeyPageQuery?.data?.items ?? []
        return {
            items: apiKeys,
            total: apiKeys.length}
    }, [apiKeyPageQuery?.data])

    const useOrganizationRemoveAPIKey= useApikeyRemoveFunction()

    const onDelete = useCallback(async (apiKey : ApiKeyDTO)=>{
        if(organizationId){
            await useOrganizationRemoveAPIKey.mutateAsync({
                organizationId: organizationId,
                id: apiKey.id
            })
            await apiKeyPageQuery.refetch()
        }
    },[organizationId])

    return (
        <Page
            headerProps={PageHeaderObject({
                title: t("manageAPIKeys"),
                rightPart: [policies.apiKeys.canCreate ? <LinkButton to={apiKeysAdd()} key="pageAddButton">{t("apiKeysList.create")}</LinkButton> : undefined]
            })}
        >
            <Stack gap={4}>
                <Typography>{t('apiKeysList.headerText1')}</Typography>
                <Typography>{t('apiKeysList.headerText2')}</Typography>
                {component}
                <APIKeysTable
                    page={apiKeysPage}
                    pagination={pagination}
                    isLoading={apiKeyPageQuery.isLoading}
                    onDeleteClick={onDelete}
                    onOffsetChange={setOffset}
                />
            </Stack>
        </Page>
    )
}
