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

interface APIKeysListPageProps {
}
export const ApikeyListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();
    const { service, keycloak, policies} = useExtendedAuth()
    const organizationId = service.getUser()?.memberOf
    const { apiKeysAdd } = useRoutesDefinition()

    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })

    const {component, submittedFilters, setOffset} = useApiKeysFilters({orgRef: getOrganizationRefs.query.data?.items, canFilterOrg: service.is_im_write_organization()})

    const pagination = useMemo((): OffsetPagination => ({ offset: submittedFilters.offset ?? Offset.default.offset, limit: submittedFilters.limit ?? Offset.default.limit }), [submittedFilters.offset, submittedFilters.limit])
    const apiKeyPageQuery = useApiKeyPageQueryFunction({
        query: {
            ...submittedFilters,
            organizationId: !service.is_im_write_organization() ? organizationId : submittedFilters.organizationId
        }
    })
    const apiKeysPage : PageQueryResult<ApiKeyDTO> = useMemo(() => {
        const apiKeys = apiKeyPageQuery?.data?.items ?? []
        const total = apiKeyPageQuery?.data?.total ?? 0
        return {
            items: apiKeys,
            total: total
        }
    }, [apiKeyPageQuery?.data])

    const useOrganizationRemoveAPIKey = useApikeyRemoveFunction()

    const onDelete = useCallback(async (apiKey : ApiKeyDTO)=>{
        if(organizationId){
            await useOrganizationRemoveAPIKey.mutateAsync({
                id: apiKey.id
            })
            await apiKeyPageQuery.refetch()
        }
    },[organizationId])

    return (
        <Page
            headerProps={PageHeaderObject({
                title: t("manageAPIKeys"),
                rightPart: [policies.apiKeyPolicies.canCreate() ? <LinkButton to={apiKeysAdd()} key="pageAddButton">{t("apiKeysList.create")}</LinkButton> : undefined]
            })}
            sx={{
                marginBottom: "50px"
            }}
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
