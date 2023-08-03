import { useTranslation } from "react-i18next";
import { PageHeaderObject, useExtendedAuth } from "components";
import { useCallback, useMemo } from "react";
import { Action, Page, Section, useFormComposable } from "@smartb/g2";
import { Typography } from "@mui/material";
import { useCreatedConfirmationPopUp } from "../../hooks";
import { ApiKeyAddCommand, useApiKeyAddFunction, useApiKeyPageQueryFunction } from "../../api/";
import { useNavigate } from "react-router-dom";
import { APIKeyForm } from "../../components";

export interface APIKeyProfilePageProps {
    readOnly: boolean
}
export const ApiKeyAddPage = (props: APIKeyProfilePageProps) => {
    const { readOnly } = props
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { service } = useExtendedAuth()
    const organizationId = service.getUser()!!.memberOf ?? ""
    const apiKeyPageQuery = useApiKeyPageQueryFunction({
        query: {
            organizationId: organizationId
        }
    })
    const apiKeyAddFunction = useApiKeyAddFunction()
    const createdConfirmation = useCreatedConfirmationPopUp();

    const createAPIKey = useCallback(async (command: Partial<ApiKeyAddCommand>) => {
        if (organizationId) {
            const result = command.name && await apiKeyAddFunction.mutateAsync({
                organizationId: organizationId,
                name: command.name
            });
            apiKeyPageQuery.refetch()
            result && createdConfirmation.open(result)
        }
    }, [organizationId]);

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
            headerProps={PageHeaderObject({
                title: t("manageAPIKeys"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" },
            })}
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
