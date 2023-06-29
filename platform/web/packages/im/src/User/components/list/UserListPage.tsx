import { Page, LinkButton } from "@smartb/g2"
import {AutomatedUserTable} from "@smartb/g2-i2-v2"
import { Typography } from "@mui/material";
import { useExtendedAuth, useRoutesDefinition } from "components";
import { useTranslation } from "react-i18next";
import { useUserFilters } from "./useUserFilters";
import { useUserListPage } from "../../hooks";
import { useMemo } from "react";
import {userTableColumns} from "@smartb/g2-i2-v2/dist/User/Components/UserTable";
import {usePolicies} from "../../../Policies/usePolicies";

interface UserListPageProps { }

export const UserListPage = (props: UserListPageProps) => {
  const { } = props;
  const { t } = useTranslation();
  const {service} = useExtendedAuth()

  const { getOrganizationUrl, getRowLink, additionalColumns } = useUserListPage()
  const { usersAdd } = useRoutesDefinition()

  const policies = usePolicies(false)

  const { component, submittedFilters, setPage } = useUserFilters({ searchOrg: policies.user.canListAllUser })

  const filters = useMemo(() => (
    {
      ...submittedFilters,
      organizationId: !policies.user.canListAllUser ? service.getUser()?.memberOf : undefined}
  ), [policies.user.canListAllUser, submittedFilters, service.getUser])

  const actions= policies.user.canCreate
    ? [(<LinkButton to={usersAdd()} key="pageAddButton">{t("userList.create")}</LinkButton>)]
    : []

  return (
    <Page
      headerProps={{
        content: [{
          leftPart: [
            <Typography variant="h5" key="pageTitle">{t("manageUsers")}</Typography>
          ],
          rightPart: actions
        }]
      }}
    >
        {component}
        <AutomatedUserTable
          columnsExtander={{
            additionalColumns,
            blockedColumns: ["address", ...(!policies.user.canListAllUser ? ["memberOf" as userTableColumns] : [])]
          }}
          getRowLink={getRowLink}
          hasOrganizations
          filters={filters}
          getOrganizationUrl={getOrganizationUrl}
          noDataComponent={<Typography align="center">{t("userList.noUserOrg")}</Typography>}
          page={submittedFilters.page + 1}
          setPage={setPage}
        />
    </Page>
  )
};
