import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {LinkButton, Page} from "@smartb/g2";
import {APIKeysTable} from "../APIKeysTable";
import {useCallback, useMemo} from "react";
import {Offset, OffsetPagination, PageQueryResult} from "template";
import {
    APIKeyDTO,
    OrganizationDTO,
    useOrganizationRemoveAPIKeyFunction
} from "../../api";
import {useOrganizationFormState} from "@smartb/g2-i2-v2";
import {useExtendedAuth, useRoutesDefinition} from "components";

interface APIKeysListPageProps {
}
export const APIKeysListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();
    const { service } = useExtendedAuth()
    const orgId = service.getUser()?.memberOf
    const { organization, getOrganization } = useOrganizationFormState<OrganizationDTO>({
        organizationId : orgId
    })
    const { apiKeysAdd } = useRoutesDefinition()
    const pagination = useMemo((): OffsetPagination => ({ offset: Offset.default.offset, limit: Offset.default.limit }), [])

    const apiKeysPage : PageQueryResult<APIKeyDTO> = useMemo(() => {
        const apiKeys = organization?.apiKeys ?? []
        return {
            items: apiKeys,
            total: apiKeys.length}
    }, [organization?.apiKeys])

    const useOrganizationRemoveAPIKey= useOrganizationRemoveAPIKeyFunction()

    const onDelete = useCallback(async (apiKey :  APIKeyDTO)=>{
        if(orgId){
            await useOrganizationRemoveAPIKey.mutateAsync({
                id: orgId,
                keyId: apiKey.id
            })
            await getOrganization.refetch()
        }
    },[organization, getOrganization])

    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography variant="h5" key="pageTitle">{t("manageAPIKeys")}</Typography>
                    ],
                    rightPart: [
                        <LinkButton to={apiKeysAdd()} key="pageAddButton">{t("apiKeysList.create")}</LinkButton>
                    ]
                }]
            }}
        >
            <Stack gap={4}>
                <Typography>{t('apiKeysList.headerText1')}</Typography>
                <Typography>{t('apiKeysList.headerText2')}</Typography>
                <APIKeysTable
                    page={apiKeysPage}
                    pagination={pagination}
                    isLoading={getOrganization.isLoading}
                    onDeleteClick={onDelete}
                />
            </Stack>
        </Page>
    )
}
