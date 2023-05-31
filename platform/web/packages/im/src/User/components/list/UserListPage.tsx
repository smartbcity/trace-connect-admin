import { Page, Section, LinkButton } from "@smartb/g2"
import { AutomatedUserTable } from "@smartb/g2-i2-v2"
import { Typography } from "@mui/material";
import { useExtendedAuth, useRoutesDefinition } from "components";
import { useTranslation } from "react-i18next";
import { useUserFilters } from "./useUserFilters";
import { useUserListPage } from "../../hooks";
import { useMemo } from "react";

interface UserListPageProps { }

export const UserListPage = (props: UserListPageProps) => {
  const { } = props;
  const { t } = useTranslation();
  const {service} = useExtendedAuth()
  
  const { getActions, getOrganizationUrl, onRowClicked, additionalColumns } = useUserListPage()
  const { usersAdd } = useRoutesDefinition()

  const canSeeAllUser = useMemo(() => service.is_super_admin(), [service.is_super_admin])

  const { component, submittedFilters, setPage } = useUserFilters({ searchOrg: canSeeAllUser })

  const filters = useMemo(() => ({...submittedFilters, organizationId: !canSeeAllUser ? service.getUser()?.memberOf : undefined}), [canSeeAllUser, submittedFilters, service.getUser])

  return (
    <Page
      headerProps={{
        content: [{
          leftPart: [
            <Typography variant="h5" key="pageTitle">{t("users")}</Typography>
          ],
          rightPart: [
            <LinkButton to={usersAdd()} key="pageAddButton">{t("userList.create")}</LinkButton>
          ]
        }]
      }}
    >
      <Section
        flexContent
      >
        {component}
        <AutomatedUserTable
          columnsExtander={{
            getActions: getActions,
            additionalColumns,
            blockedColumns: canSeeAllUser ? ["memberOf"] : undefined
          }}
          onRowClicked={onRowClicked}
          hasOrganizations
          filters={filters}
          getOrganizationUrl={getOrganizationUrl}
          noDataComponent={<Typography align="center">{t("userList.noUser")}</Typography>}
          page={submittedFilters.page + 1}
          setPage={setPage}
        />
      </Section>
    </Page>
  )
};
