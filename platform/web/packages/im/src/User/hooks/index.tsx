import { Chip } from "@smartb/g2-components";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {LinkProps, useNavigate} from "react-router-dom";
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
import {useQueryClient} from "react-query";


export const useUserListPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const {service, keycloak} = useExtendedAuth()

    const {usersUserIdEdit, usersUserIdView, organizationsOrganizationIdView} = useRoutesDefinition()

    const userDisable = useUserDisable2({
        apiUrl : i2Config().userUrl,
        jwt : keycloak.token
    })
  
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

    const queryClient = useQueryClient()

    const onDeleteClick = useCallback(
        async (user : User) => {
            await userDisable.mutateAsync({
                id: user.id,
                anonymize: true
            })
            queryClient.invalidateQueries('users')
        }, []
    )

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
              const declineConfirmation = useDeleteUserPopUp({onDeleteClick : onDeleteClick})

              const handleDeleteClick = useCallback(
                  (user : User) => {
                      declineConfirmation.open(user);
                  },
                  [declineConfirmation]
              );

              return <><TableCellAdmin onDelete={() => handleDeleteClick(row.original)} onEdit={() => navigate(usersUserIdEdit(row.original.id))} />{declineConfirmation.popup}</>
        },
      },
    ]
    }, [service.getPrincipalRole])

    return {
        getRowLink: getRowLink,
        getOrganizationUrl,
        additionalColumns
    }
}