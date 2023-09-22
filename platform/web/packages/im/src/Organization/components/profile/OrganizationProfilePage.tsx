import { PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components"
import { Typography } from '@mui/material'
import {Page, Section, LinkButton, Button} from '@smartb/g2'
import { Organization, useOrganizationDisable } from 'connect-im'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {OrganizationForm} from "./OrganizationForm";
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteOrganizationPopUp } from "../hooks/useDeleteOrganizationPopUp"
import { useOrganizationFunctionnalities } from "./useOrganizationFunctionnalities"

export interface OrganizationProfilePageProps {
    myOrganization?: boolean
}

export const OrganizationProfilePage = (props: OrganizationProfilePageProps) => {
    const {  myOrganization = false } = props
    const { t } = useTranslation();
    const { service, policies } = useExtendedAuth()
    const { organizationId = service.getUser()?.memberOf } = useParams();
    const navigate = useNavigate()
    const { organizationsOrganizationIdEdit, organizations } = useRoutesDefinition()

    const orgDisable = useOrganizationDisable({
    })
    const queryClient = useQueryClient()

    const onDeleteClick = useCallback(
        async (organization : Organization) => {
            const res = await orgDisable.mutateAsync({
                id: organization.id,
                anonymize: true
            })
            queryClient.invalidateQueries({ queryKey: ["organizationRefs"] })
            queryClient.invalidateQueries({ queryKey: ["organizationPage"] })
            queryClient.invalidateQueries({ queryKey: ["organizationGet"] })
            if (res) navigate(organizations())
        }, [organizations]
    )

    const {open, popup} = useDeleteOrganizationPopUp({onDeleteClick : onDeleteClick})

    const {formState, isLoading, organization} = useOrganizationFunctionnalities({
        myOrganization,
        organizationId
    })

    const headerRightPart = useMemo(() => {
        if (organization) {
            return [
                policies.organization.canDelete() ? <Button onClick={() => {
                    open(organization)
                }} color="error" key="deleteButton">{t("closeOrganization")}</Button> : undefined,
                policies.organization.canUpdate(organizationId!) ? <LinkButton to={organizationsOrganizationIdEdit(organizationId!)} key="pageEditButton">{t("update")}</LinkButton> : undefined,
            ]
        }
        return []
    }, [ organizationId, organizationsOrganizationIdEdit, organization, policies.organization])


    return (
        <Page
            headerProps={PageHeaderObject({
                title: myOrganization ? t("manageAccount") : organization?.name ?? t("organizations"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" },
                rightPart: headerRightPart
            })}
        >
                <Section flexContent>
                    <Typography color="secondary" variant="h5">{t('organizationSummary')}</Typography>
                    <OrganizationForm myOrganization={myOrganization} isLoading={isLoading} formState={formState} readOnly />
                </Section>
                {popup}
        </Page>
    )
}
