import { MenuItem, Chip } from "@smartb/g2-components";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {LinkProps} from "react-router-dom";
import { EditRounded, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { G2ColumnDef } from "@smartb/g2-layout";
import { Row } from '@tanstack/react-table'
import {
    useExtendedAuth,
    useRoutesDefinition,
    UserRoles,
    userRolesColors,
    TableCellAdmin
} from "components";
import {User, useUserDisable2} from "@smartb/g2-i2-v2";
import {i2Config} from "@smartb/g2-providers";
import {useDeleteUserPopUp} from "./useDeleteUserPopUp";


export const useUserListPage = () => {

    const { t } = useTranslation();

    const {service, keycloak} = useExtendedAuth()

    const {usersUserIdEdit, usersUserIdView, organizationsOrganizationIdView} = useRoutesDefinition()

    const userDisable = useUserDisable2({
        apiUrl : i2Config().userUrl,
        jwt : keycloak.token
    })

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

    const onDeleteClick = useCallback(
        async (user : User) => {
            await userDisable.mutateAsync({
                id: user.id,
                anonymize: true
            })
            window.location.reload()
        }, []
    )

    const declineConfirmation = useDeleteUserPopUp({onDeleteClick : onDeleteClick})

    const handleDeleteClick = useCallback(
        (user : User) => {
            declineConfirmation.open(user);
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
          cell: ({row}) => {
             return <><TableCellAdmin onDelete={() => handleDeleteClick(row.original)} onEdit={() =>{}} />{declineConfirmation.popup}</>
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