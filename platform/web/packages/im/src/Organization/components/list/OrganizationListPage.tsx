import { useRoutesDefinition } from "components"
import { EditRounded, PersonAddAltRounded, Visibility } from "@mui/icons-material"
import { Typography } from "@mui/material"
import { MenuItem, Page, Section, LinkButton } from "@smartb/g2"
import { AutomatedOrganizationTable, Organization } from "@smartb/g2-i2-v2"
import { Row } from '@tanstack/react-table'
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Link, LinkProps, useNavigate } from "react-router-dom"
import { useOrganizationFilters } from "./useOrganizationFilters"

interface OrganizationListPageProps { }

export const OrganizationListPage = (props: OrganizationListPageProps) => {
  const { } = props;
  const { t } = useTranslation();
  const navigate = useNavigate()

  const {component, submittedFilters, setPage} = useOrganizationFilters()

  const { organizationsOrganizationIdView, organizationsOrganizationIdEdit, usersAdd, organizationsAdd } = useRoutesDefinition()

  const getActions = useCallback(
    (org: Organization): MenuItem<LinkProps>[] => {
      return [
        {
          key: "view",
          label: t("view"),
          icon: <Visibility />,
          component: Link,
          componentProps: {
            to: organizationsOrganizationIdView(org.id)
          }
        },
        {
          key: "edit",
          label: t("edit"),
          icon: <EditRounded />,
          component: Link,
          componentProps: {
            to: organizationsOrganizationIdEdit(org.id)
          }
        },
        {
          key: "addUser",
          label: t("userList.create"),
          icon: <PersonAddAltRounded />,
          component: Link,
          componentProps: {
            to: usersAdd(org.id)
          }
        }
      ]
    },
    [],
  )

  const onRowClicked = useCallback(
    (row: Row<Organization>) => {
      navigate(organizationsOrganizationIdView(row.original.id))
    },
    [navigate],
  )

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
      <Section
      flexContent
      >
        {component}
        <AutomatedOrganizationTable
          columnsExtander={{
            getActions: getActions,
          }}
          filters={submittedFilters}
          onRowClicked={onRowClicked}
          noDataComponent={<Typography align="center">{t("organizationList.noOrganization")}</Typography>}
          page={submittedFilters.page + 1}
          setPage={setPage}
        />

      </Section>
    </Page>
  )
};

