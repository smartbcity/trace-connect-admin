import { useRoutesDefinition } from "components"
import { Typography } from "@mui/material"
import { Page, LinkButton } from "@smartb/g2"
import { AutomatedOrganizationTable } from "@smartb/g2-i2-v2"
import { useTranslation } from "react-i18next"
import { useOrganizationFilters } from "./useOrganizationFilters"
import {useOrganizationListPage} from "../hooks";

interface OrganizationListPageProps { }

export const OrganizationListPage = (props: OrganizationListPageProps) => {
  const { } = props;
  const { t } = useTranslation();

  const { additionalColumns, getRowLink } = useOrganizationListPage()
  const {component, submittedFilters, setPage} = useOrganizationFilters()

  const { organizationsAdd } = useRoutesDefinition()

  return (
    <Page
      headerProps={{
        content: [{
          leftPart: [
            <Typography variant="h5" key="pageTitle">{t("organizations")}</Typography>
          ],
          rightPart: [
            <LinkButton to={organizationsAdd()} key="pageAddButton">{t("organizationList.create")}</LinkButton>
          ]
        }]
      }}
    >
        {component}
        <AutomatedOrganizationTable
          columnsExtander={{
            additionalColumns
          }}
          filters={submittedFilters}
          getRowLink={getRowLink}
          noDataComponent={<Typography align="center">{t("organizationList.noOrganization")}</Typography>}
          page={submittedFilters.page + 1}
          setPage={setPage}
        />
    </Page>
  )
};

