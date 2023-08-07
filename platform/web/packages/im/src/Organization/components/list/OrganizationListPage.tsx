import { PageHeaderObject, useRoutesDefinition } from "components"
import { Typography } from "@mui/material"
import { Page, LinkButton } from "@smartb/g2"
import { AutomatedOrganizationTable } from "@smartb/g2-i2-v2"
import { useTranslation } from "react-i18next"
import { useOrganizationFilters } from "./useOrganizationFilters"
import { useOrganizationListPage } from "../hooks";
import { usePolicies } from "../../../Policies/usePolicies";

interface OrganizationListPageProps { }

export const OrganizationListPage = (props: OrganizationListPageProps) => {
  const { } = props;
  const { t } = useTranslation()
  const policies = usePolicies()
  const { columns, getRowLink } = useOrganizationListPage()
  const { component, submittedFilters, setPage } = useOrganizationFilters()

  const { organizationsAdd } = useRoutesDefinition()
  const actions = policies.organization.canCreate ? [(<LinkButton to={organizationsAdd()} key="pageAddButton">{t("organizationList.create")}</LinkButton>)] : []

 

  return (
    <Page
      headerProps={PageHeaderObject({
        title: t("organizations"),
        rightPart: actions
      })}
    >
      {component}
      <AutomatedOrganizationTable
        tableStateParams={{
          columns
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

