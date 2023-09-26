import { PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components"
import { Typography } from "@mui/material"
import { Page, LinkButton } from "@smartb/g2"
import { OrganizationTable, useGetOrganizations, useOrganizationTableState } from "connect-im"
import { useTranslation } from "react-i18next"
import { useOrganizationFilters } from "./useOrganizationFilters"
import { useOrganizationListPage } from "../hooks";
import { FixedPagination } from "template/src/OffsetTable/FixedPagination"
import { useMemo } from "react"

interface OrganizationListPageProps { }

export const OrganizationListPage = (props: OrganizationListPageProps) => {
  const { } = props;
  const { t } = useTranslation()
  const { policies } = useExtendedAuth()
  const { columns, getRowLink } = useOrganizationListPage()
  const { component, submittedFilters, setOffset } = useOrganizationFilters()

  const { organizationsAdd } = useRoutesDefinition()
  const actions = policies.organization.canCreate() ? [(<LinkButton to={organizationsAdd()} key="pageAddButton">{t("organizationList.create")}</LinkButton>)] : []

  const getOrganizations = useGetOrganizations({
    query: submittedFilters
  })

  const tableState = useOrganizationTableState({
    organizations: getOrganizations.data?.items ?? [],
    columns
  })

  const page = useMemo(() => ({
    items: getOrganizations.data?.items ?? [],
    total: getOrganizations.data?.total ?? 0
  }), [getOrganizations.data])

  return (
    <Page
      headerProps={PageHeaderObject({
        title: t("organizations"),
        rightPart: actions
      })}
      sx={{
        marginBottom: "60px"
      }}
    >
      {component}
      <OrganizationTable
        isLoading={!getOrganizations.isSuccess}
        tableState={tableState}
        getRowLink={getRowLink}
        noDataComponent={<Typography align="center">{t("organizationList.noOrganization")}</Typography>}
      />
      <FixedPagination pagination={submittedFilters} page={page} isLoading={!getOrganizations.isSuccess} onOffsetChange={setOffset} />
    </Page>
  )
};

