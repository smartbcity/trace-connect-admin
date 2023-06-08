import { MenuItem, Chip } from "@smartb/g2-components";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LinkProps } from "react-router-dom";
import { EditRounded, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { G2ColumnDef } from "@smartb/g2-layout";
import { Row } from '@tanstack/react-table'
import {
    useExtendedAuth,
    useRoutesDefinition,
    UserRoles,
    userRolesColors,
    TableCellAdmin,
    useDeletedConfirmationPopUp
} from "components";
import { User } from "@smartb/g2-i2-v2";
import {Typography} from "@mui/material";


export const useUserListPage = () => {

    const { t } = useTranslation();

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
  
    const getRowLink = useCallback(
      (row: Row<User>) : LinkProps => ({
        to: usersUserIdView(row.original.id)
      }),
      [usersUserIdView],
    )
  
    const getOrganizationUrl = useCallback(
      (organizationId: string) => organizationsOrganizationIdView(organizationId),
      [organizationsOrganizationIdView],
    )

    const declineConfirmation = useDeletedConfirmationPopUp({
        title: t("userList.delete"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("userList.deleteMessage")}</Typography>,
        onDelete : (() => {return}) // en attendant back
    });

    const onDelete = useCallback(
        () => {
            declineConfirmation.handleOpen();
        },
        [declineConfirmation]
    );
    
    const additionalColumns = useMemo((): G2ColumnDef<User>[] => {
      return [{
        header: t("role"),
        id: "role",
        cell: ({row}) => {
          const role = service.getPrincipalRole((row.original.roles ?? []) as UserRoles[]) as UserRoles
          return <Chip label={t("roles." + role)} color={userRolesColors[role]} />;
        },
      },{
        header: t("actions"),
          id: "delete",
          cell: ({}) => {
             return <><TableCellAdmin onDelete={onDelete} onEdit={() =>{}} />{declineConfirmation.popup}</>
        },
      },
    ]
    }, [service.getPrincipalRole, declineConfirmation])

    return {
        getActions,
        getRowLink: getRowLink,
        getOrganizationUrl,
        additionalColumns
    }
}