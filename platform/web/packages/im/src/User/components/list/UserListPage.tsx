import { Page, LinkButton } from "@smartb/g2"
import { AutomatedUserTable } from "@smartb/g2-i2-v2"
import { Typography } from "@mui/material";
import { PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components";
import { useTranslation } from "react-i18next";
import { useUserFilters } from "./useUserFilters";
import { useUserListPage } from "../../hooks";
import { useMemo } from "react";
import { usePolicies } from "../../../Policies/usePolicies";

export const UserListPage = () => {
  const { t } = useTranslation();
  const { service, roles, policies } = useExtendedAuth()

  const { getRowLink, columns } = useUserListPage()
  const { usersAdd } = useRoutesDefinition()

  const frontPolicies = usePolicies()

  const { component, submittedFilters, setPage } = useUserFilters({ searchOrg: frontPolicies.user.canListAllUser })

  

  const filters = useMemo(() => (
    {
      ...submittedFilters,
      roles: submittedFilters.roles ? [
        //@ts-ignore
        ...(submittedFilters.roles.includes("user") ? roles.filter((role) => role.indentifier.includes("user")) : []),
         //@ts-ignore
        ...(submittedFilters.roles.includes("admin") ? roles.filter((role) => role.indentifier.includes("admin")) : [])
      ] : undefined,
      organizationId: !frontPolicies.user.canListAllUser ? service.getUser()?.memberOf : undefined
    }
  ), [frontPolicies.user.canListAllUser, submittedFilters, service.getUser, roles])

  const actions = policies.user.canCreate()
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
