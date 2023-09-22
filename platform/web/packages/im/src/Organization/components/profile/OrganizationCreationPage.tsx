import { PageHeaderObject } from "components"
import { Typography } from '@mui/material'
import {Page, Section} from '@smartb/g2'
import { useTranslation } from 'react-i18next'
import {OrganizationForm} from "./OrganizationForm";
import { useOrganizationFunctionnalities } from "./useOrganizationFunctionnalities"

export const OrganizationCreationPage = () => {
    const { t } = useTranslation();
    const {formActions, formState, isLoading} = useOrganizationFunctionnalities()

    return (
        <Page
            headerProps={PageHeaderObject({
                title: t("organizations"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" },
            })}
            bottomActionsProps={{
                actions: formActions
            }}
        >
                <Section flexContent>
                    <Typography color="secondary" variant="h5">{t('organizationSummary')}</Typography>
                    <OrganizationForm isLoading={isLoading} formState={formState}/>
                </Section>
        </Page>
    )
}
