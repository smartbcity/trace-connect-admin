import { Page, LinkButton } from "@smartb/g2"
import { UserTable, useGetUsers, useUserTableState } from "connect-im"
import { Typography } from "@mui/material";
import { PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components";
import { useTranslation } from "react-i18next";
import { useUserFilters } from "./useUserFilters";
import { useUserListPage } from "../../hooks";
import { useMemo } from "react";
import { usePolicies } from "../../../Policies/usePolicies";
import { FixedPagination } from "template/src/OffsetTable/FixedPagination";

export const UserListPage = () => {
  const { t } = useTranslation();
  const { service, roles, policies } = useExtendedAuth()

  const { getRowLink, columns } = useUserListPage()
  const { usersAdd } = useRoutesDefinition()

  const frontPolicies = usePolicies()

  const { component, submittedFilters, setOffset } = useUserFilters({ searchOrg: frontPolicies.user.canListAllUser })

  const filters = useMemo(() => (
    {
      ...submittedFilters,
      roles: submittedFilters.roles ? [
        ...(submittedFilters.roles?.includes("user") ? (roles ?? [])?.map((role) => role.identifier).filter((role) => role.includes("user")) : []),
        ...(submittedFilters.roles?.includes("admin") ? (roles ?? [])?.map((role) => role.identifier).filter((role) => role.includes("admin")) : [])
      ] : undefined,
      organizationId: !frontPolicies.user.canListAllUser ? service.getUser()?.memberOf : undefined
    }
  ), [frontPolicies.user.canListAllUser, submittedFilters, service.getUser, roles])

  const actions = policies.user.canCreate(service.getUser()?.memberOf)
    ? [(<LinkButton to={usersAdd()} key="pageAddButton">{t("userList.create")}</LinkButton>)]
    : []

  const getUsers = useGetUsers({
    query: filters
  })

  const tableState = useUserTableState({
    users: getUsers.data?.items ?? [],
    hasOrganizations: true,
    columns
  })

  const page = useMemo(() => ({
    items: getUsers.data?.items ?? [],
    total: getUsers.data?.total ?? 0
  }), [getUsers.data])

  return (
    <Page
      headerProps={PageHeaderObject({
        title: t("users"),
        rightPart: actions
      })}
      sx={{
        marginBottom: "60px"
      }}
    >
      {component}
      <UserTable
        isLoading={!getUsers.isSuccess}
        tableState={tableState}
        getRowLink={getRowLink}
        noDataComponent={<Typography align="center">{t("userList.noUserOrg")}</Typography>}
      />
      <FixedPagination pagination={submittedFilters} page={page} isLoading={!getUsers.isSuccess} onOffsetChange={setOffset} />
    </Page>
  )
};
