import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {Button, Page} from "@smartb/g2";
import {APIKeysTable} from "../APIKeysTable";
import {useCallback, useMemo} from "react";
import {Offset, OffsetPagination, PageQueryResult} from "template";
import {useCreatedConfirmationPopUp} from "../../hooks";
import {useParams} from "react-router-dom";
import {
    APIKeyDTO,
    OrganizationDTO,
    useOrganizationAddAPIKeyFunction,
    useOrganizationRemoveAPIKeyFunction
} from "../../api";
import {useOrganizationFormState} from "@smartb/g2-i2-v2";
import {useExtendedAuth} from "components";

interface APIKeysListPageProps {
    myOrganization?: boolean
}

export const APIKeysListPage = (props: APIKeysListPageProps) => {
    const { myOrganization = false  } = props;
    const { t } = useTranslation();
    const { service } = useExtendedAuth()

    const { organizationId } = useParams();
    const orgId = myOrganization ? service.getUser()?.memberOf : organizationId
    const { organization, getOrganization } = useOrganizationFormState<OrganizationDTO>({
        organizationId : orgId
    })
    console.log(organization)

    // const { apiKeysAdd } = useRoutesDefinition()
    const pagination = useMemo((): OffsetPagination => ({ offset: Offset.default.offset, limit: Offset.default.limit }), [])
    const organizationAddAPIKeyFunction = useOrganizationAddAPIKeyFunction()
    const createdConfirmation = useCreatedConfirmationPopUp();


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

    const createAPIKey = useCallback(async () => {
        if (organization) {
            const result = await organizationAddAPIKeyFunction.mutateAsync({
                id: organization.id,
                name: `sb-${organization?.name}-${organization?.apiKeys.length+1}`
            });
            await getOrganization.refetch()
            result && createdConfirmation.open(result);
        }
    }, [organization, createdConfirmation]);

    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography variant="h5" key="pageTitle">{t("manageAPIKeys")}</Typography>
                    ],
                    rightPart: [
                        // LinkButton to={apiKeysAdd()}
                        <Button onClick={createAPIKey} key="pageAddButton">{t("apiKeysList.create")}</Button>
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
            {createdConfirmation.popup}
        </Page>
    )
}
