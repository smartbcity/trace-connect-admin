import { Page, LinkButton } from "@smartb/g2"
import { AutomatedUserTable } from "@smartb/g2-i2-v2"
import { Typography } from "@mui/material";
import { PageHeaderObject, useExtendedAuth, useRoutesDefinition, userAdminRoles, userBaseRoles } from "components";
import { useTranslation } from "react-i18next";
import { useUserFilters } from "./useUserFilters";
import { useUserListPage } from "../../hooks";
import { useMemo } from "react";
import { usePolicies } from "../../../Policies/usePolicies";

export const UserListPage = () => {
  const { t } = useTranslation();
  const { service } = useExtendedAuth()

  const { getRowLink, columns } = useUserListPage()
  const { usersAdd } = useRoutesDefinition()

  const policies = usePolicies()

  const { component, submittedFilters, setPage } = useUserFilters({ searchOrg: policies.user.canListAllUser })

  

  const filters = useMemo(() => (
    {
      ...submittedFilters,
      roles: submittedFilters.roles ? [
        ...(submittedFilters.roles.includes("user") ? userBaseRoles : []),
        ...(submittedFilters.roles.includes("admin") ? userAdminRoles : [])
      ] : undefined,
      organizationId: !policies.user.canListAllUser ? service.getUser()?.memberOf : undefined
    }
  ), [policies.user.canListAllUser, submittedFilters, service.getUser])

  const actions = policies.user.canCreate
    ? [(<LinkButton to={usersAdd()} key="pageAddButton">{t("userList.create")}</LinkButton>)]
    : []

  return (
    <Page
      headerProps={PageHeaderObject({
        title: t("manageUsers"),
        rightPart: actions
      })}
    >
      {component}
      <AutomatedUserTable
        tableStateParams={{
          columns
        }}
        getRowLink={getRowLink}
        hasOrganizations
        filters={filters}
        noDataComponent={<Typography align="center">{t("userList.noUserOrg")}</Typography>}
        page={submittedFilters.page + 1}
        setPage={setPage}
      />
    </Page>
  )
};
