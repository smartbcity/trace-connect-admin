import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {LinkButton, Page} from "@smartb/g2";
import {useCallback, useMemo} from "react";
import {Offset, OffsetPagination, PageQueryResult} from "template";
import {PageHeaderObject, useExtendedAuth, useRoutesDefinition} from "components";
import {ApiKeyDTO, useApiKeyPageQueryFunction, useApikeyRemoveFunction} from "../../api";
import {APIKeysTable} from "../../components";

interface APIKeysListPageProps {
}
export const ApikeyListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();
    const { service} = useExtendedAuth()
    const organizationId = service.getUser()?.memberOf
    const { apiKeysAdd } = useRoutesDefinition()
    const pagination = useMemo((): OffsetPagination => ({ offset: Offset.default.offset, limit: Offset.default.limit }), [])
    const apiKeyPageQuery = useApiKeyPageQueryFunction({
        query: {
            organizationId: organizationId
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
                rightPart: [<LinkButton to={apiKeysAdd()} key="pageAddButton">{t("apiKeysList.create")}</LinkButton>]
            })}
        >
            <Stack gap={4}>
                <Typography>{t('apiKeysList.headerText1')}</Typography>
                <Typography>{t('apiKeysList.headerText2')}</Typography>
                <APIKeysTable
                    page={apiKeysPage}
                    pagination={pagination}
                    isLoading={apiKeyPageQuery.isLoading}
                    onDeleteClick={onDelete}
                />
            </Stack>
        </Page>
    )
}
