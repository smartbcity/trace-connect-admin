import {useTranslation} from "react-i18next";
import {IconButton, Stack, Typography} from "@mui/material";
import {Button, Page, TextField} from "@smartb/g2";
import {APIKeysTable} from "../APIKeysTable";
import {useCallback, useMemo, useState} from "react";
import {Offset, OffsetPagination, PageQueryResult} from "template";
import {useCreatedConfirmationPopUp} from "../../hooks";
import {VisibilityRounded} from "@mui/icons-material";
import {useParams} from "react-router-dom";
import {APIKeyDTO, OrganizationDTO, useOrganizationAddAPIKeyFunction} from "../../api";
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
    const { organization } = useOrganizationFormState<OrganizationDTO>({
        organizationId : orgId
    })

    // const { apiKeysAdd } = useRoutesDefinition()
    const pagination = useMemo((): OffsetPagination => ({ offset: Offset.default.offset, limit: Offset.default.limit }), [])
    const [isHidden, setHidden] = useState(true)
    const organizationAddAPIKeyFunction = useOrganizationAddAPIKeyFunction()
    const createdConfirmation = useCreatedConfirmationPopUp({
        title: t("apiKeysList.created"),
        component :
            <Stack gap={(theme) => `${theme.spacing(4)}`} sx={{margin : (theme) => `${theme.spacing(4)} 0`}}>
                <Typography>{t("apiKeysList.createdMessage")}</Typography>
                <TextField type="password" value={""} hidden={isHidden} iconPosition='end' inputIcon={<IconButton onClick={() => {setHidden(!isHidden)}}><VisibilityRounded /></IconButton>} />
            </Stack>
    });

    const apiKeysPage : PageQueryResult<APIKeyDTO> = useMemo(() => {
        const apiKeys = organization?.apiKeys ?? []
        return {
            items: apiKeys,
            total: apiKeys.length}
    }, [organization?.apiKeys])

    const createAPIKey = useCallback(async () => {
        if (organization) {
            await organizationAddAPIKeyFunction.mutateAsync({
                id: organization.id,
                name: `sb-${organization?.name}-${organization?.apiKeys.length}`
            });
            createdConfirmation.handleOpen();
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
                    isLoading={organizationAddAPIKeyFunction.isLoading}
                    orgId={orgId}
                />
            </Stack>
            {createdConfirmation.popup}
        </Page>
    )
}
