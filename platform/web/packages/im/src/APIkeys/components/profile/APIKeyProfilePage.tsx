import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import {useExtendedAuth} from "components";
import {useCallback, useMemo} from "react";
import {Action, Page, Section, useFormComposable} from "@smartb/g2";
import {Typography} from "@mui/material";
import { APIKeyForm } from "./APIKeyForm";
import {OrganizationAddApiKeyCommand, OrganizationDTO, useOrganizationAddAPIKeyFunction} from "../../api";
import {useOrganizationFormState} from "@smartb/g2-i2-v2";
import {useCreatedConfirmationPopUp} from "../../hooks";

export interface APIKeyProfilePageProps {
    readOnly: boolean
}
export const APIKeyProfilePage = (props: APIKeyProfilePageProps) => {
    const { readOnly} = props
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { service } = useExtendedAuth()
    const { organization, getOrganization } = useOrganizationFormState<OrganizationDTO>({
        organizationId : service.getUser()?.memberOf
    })
    const organizationAddAPIKeyFunction = useOrganizationAddAPIKeyFunction()
    const createdConfirmation = useCreatedConfirmationPopUp();


    const createAPIKey = useCallback(async (command : Partial<OrganizationAddApiKeyCommand>) => {
        if (organization) {
            const result = command.name && await organizationAddAPIKeyFunction.mutateAsync({
                id: organization.id,
                name : command.name
            });
            await getOrganization.refetch()
            result && createdConfirmation.open(result)
        }
    }, [organization]);

    const formState = useFormComposable({
        emptyValueInReadOnly: "-",
        readOnly: false,
        onSubmit: createAPIKey
    })

    const actions = useMemo((): Action[] | undefined => {
        if (!readOnly) {
            return [{
                key: "cancel",
                label: t("cancel"),
                onClick: () => navigate(-1),
                variant: "text"
            }, {
                key: "save",
                label: t("save"),
                onClick: formState.submitForm
            }]
        }
    }, [readOnly, formState.submitForm])

    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography sx={{ flexShrink: 0 }} color="secondary" variant="h5" key="pageTitle">{t("manageAPIKeys")}</Typography>
                    ]
                }]
            }}
            bottomActionsProps={{
                actions: actions
            }}
        >
            <Section flexContent>
                <Typography color="secondary" variant="h5">{t('apiKeySummary')}</Typography>
                <APIKeyForm readOnly={readOnly} formState={formState} />
            </Section>
            {createdConfirmation.popup}
        </Page>
    )
}
