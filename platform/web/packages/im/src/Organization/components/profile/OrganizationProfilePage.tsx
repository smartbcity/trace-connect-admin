import { PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components"
import { Typography } from '@mui/material'
import {Action, Page, Section, LinkButton} from '@smartb/g2'
import {Organization, useOrganizationFormState} from '@smartb/g2-i2-v2'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {OrganizationForm} from "./OrganizationForm";
import {usePolicies} from "../../../Policies/usePolicies";

export interface OrganizationProfilePageProps {
    readOnly: boolean
    myOrganization?: boolean
}

export const OrganizationProfilePage = (props: OrganizationProfilePageProps) => {
    const { readOnly, myOrganization = false } = props
    const { t } = useTranslation();
    const { organizationId } = useParams();
    const navigate = useNavigate()
    const { service } = useExtendedAuth()
    const policies = usePolicies({myOrganization: myOrganization})
    const { organizationsOrganizationIdView, organizationsOrganizationIdEdit } = useRoutesDefinition()

    const orgId = myOrganization ? service.getUser()?.memberOf : organizationId
    const isUpdate = !!organizationId || myOrganization

    const onSave = useCallback(
        (data?: {
            id: string;
        }) => {
            data && navigate(organizationsOrganizationIdView(data.id))
        },
        [navigate, organizationsOrganizationIdView],
    )
    const readOnlyAddress = useCallback(
        (organization: Organization) =>
            organization.address?.street !== ""
                ? { readOnlyAddress: `${organization.address?.street}, ${organization.address?.postalCode} ${organization.address?.city}` }
                : { readOnlyAddress: undefined },
        []
    );


    const { formState, isLoading, organization } = useOrganizationFormState({
        createOrganizationOptions: {
            onSuccess: onSave,
        },
        updateOrganizationOptions: {
            onSuccess: onSave,
        },
        organizationId,
        update: isUpdate,
        myOrganization: myOrganization,
        multipleRoles: true,
        extendInitialValues : readOnlyAddress

    })

    const headerRightPart = useMemo(() => {
        if (readOnly && policies.organization.canUpdate) {
            return [
               <LinkButton to={organizationsOrganizationIdEdit(orgId!)} key="pageEditButton">{t("update")}</LinkButton>,
            ]
        }
        return []
    }, [readOnly, orgId, organizationsOrganizationIdEdit])

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
                title: myOrganization ? t("manageAccount") : organization?.name ?? t("organizations"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" },
                rightPart: headerRightPart
            })}
            bottomActionsProps={{
                actions: actions
            }}
        >
                <Section flexContent>
                    <Typography color="secondary" variant="h5">{t('organizationSummary')}</Typography>
                    <OrganizationForm isLoading={isLoading} formState={formState} readOnly={readOnly}/>
                </Section>
        </Page>
    )
}
