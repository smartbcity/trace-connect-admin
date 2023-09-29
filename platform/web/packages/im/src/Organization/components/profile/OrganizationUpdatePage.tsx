import { PageHeaderObject, useExtendedAuth } from "components"
import { Typography } from '@mui/material'
import { Page, Section } from '@smartb/g2'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { OrganizationForm } from "./OrganizationForm";
import { useOrganizationFunctionnalities } from "./useOrganizationFunctionnalities"

export interface OrganizationUpdatePageProps {
    myOrganization?: boolean
}

export const OrganizationUpdatePage = (props: OrganizationUpdatePageProps) => {
    const { myOrganization = false } = props
    const { t } = useTranslation();
    const { service } = useExtendedAuth()
    const { organizationId = service.getUser()?.memberOf } = useParams();
    const {formActions, formState, isLoading, organization } = useOrganizationFunctionnalities({
        isUpdate: true,
        organizationId,
        myOrganization
    })

    return (
        <Page
            headerProps={PageHeaderObject({
                title: myOrganization ? t("account") : organization?.name ?? t("organizations"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" }
            })}
            bottomActionsProps={{
                actions: formActions
            }}
        >
            <Section flexContent>
                <Typography color="secondary" variant="h5">{t('organizationSummary')}</Typography>
                <OrganizationForm myOrganization={myOrganization} isUpdate={true} isLoading={isLoading} formState={formState} readOnly={false} />
            </Section>
        </Page>
    )
}
