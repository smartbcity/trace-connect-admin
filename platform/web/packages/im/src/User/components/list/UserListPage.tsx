import { Page, Section, LinkButton } from "@smartb/g2"
import { AutomatedUserTable } from "@smartb/g2-i2-v2"
import { Typography } from "@mui/material";
import { useRoutesDefinition } from "components";
import { useTranslation } from "react-i18next";
import { useUserFilters } from "./useUserFilters";
import { useUserListPage } from "../../hooks";

interface UserListPageProps { }

export const UserListPage = (props: UserListPageProps) => {
  const { } = props;
  const { t } = useTranslation();
  const { getActions, getOrganizationUrl, onRowClicked, additionnalColumns } = useUserListPage()
  const { usersAdd } = useRoutesDefinition()

  const { component, submittedFilters, setPage } = useUserFilters({ searchOrg: true })

  return (
    <Page
      headerProps={{
        content: [{
          leftPart: [
            <Typography color="primary" variant="h5" key="pageTitle">{t("users")}</Typography>
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
            additionnalColumns,
          }}
          onRowClicked={onRowClicked}
          hasOrganizations
          filters={submittedFilters}
          getOrganizationUrl={getOrganizationUrl}
          noDataComponent={<Typography align="center">{t("userList.noUser")}</Typography>}
          page={submittedFilters.page + 1}
          setPage={setPage}
        />
      </Section>
    </Page>
  )
};
