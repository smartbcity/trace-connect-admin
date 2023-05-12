import { MenuItem, Chip } from "@smartb/g2-components";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { LinkProps } from "react-router-dom";
import { EditRounded, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Row, Column } from "@smartb/g2-layout";
import { useExtendedAuth, useRoutesDefinition, UserRoles, userRolesColors } from "components";
import { User } from "@smartb/g2-i2-v2";


export const useUserListPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate()

    const {service} = useExtendedAuth()

    const {usersUserIdEdit, usersUserIdView, organizationsOrganizationIdView} = useRoutesDefinition()
  
    const getActions = useCallback(
      (user: User): MenuItem<LinkProps>[] => {
        return [
          {
            key: "view",
            label: t("view"),
            icon: <Visibility />,
            component: Link,
            componentProps: {
              to: usersUserIdView(user.id)
            }
          },
          ...(service.hasUserRouteAuth({route: "users/:userId/edit"}) ? [{
            key: "edit",
            label: t("edit"),
            icon: <EditRounded />,
            component: Link,
            componentProps: {
              to: usersUserIdEdit(user.id)
            }
          }] : [])
        ]
      },
      [service.hasUserRouteAuth, usersUserIdEdit, usersUserIdView],
    )
  
    const onRowClicked = useCallback(
      (row: Row<User>) => {
        navigate(usersUserIdView(row.original.id))
      },
      [navigate, usersUserIdView],
    )
  
    const getOrganizationUrl = useCallback(
      (organizationId: string) => organizationsOrganizationIdView(organizationId),
      [organizationsOrganizationIdView],
    )
    
    const additionnalColumns = useMemo((): Column<User>[] => {
      return [{
        Header: t("role"),
        accessor: "role",
        Cell: ({row}) => {
          const role = service.getPrincipalRole((row.original.roles ?? []) as UserRoles[]) as UserRoles
          return <Chip label={t("roles." + role)} color={userRolesColors[role]} />;
        },
      }
    ]
    }, [service.getPrincipalRole])

    return {
        getActions,
        onRowClicked,
        getOrganizationUrl,
        additionnalColumns
    }
}