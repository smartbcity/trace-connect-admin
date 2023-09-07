import { Chip } from "@smartb/g2-components";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LinkProps, useNavigate } from "react-router-dom";
import { G2ColumnDef } from "@smartb/g2-layout";
import { Row } from '@tanstack/react-table'
import {
  useExtendedAuth,
  useRoutesDefinition,
  TableCellAdmin,
  getUserRoleColor
} from "components";
import { User, useUserColumns, useUserDisable2 } from "@smartb/g2-i2-v2";
import { i2Config } from "@smartb/g2-providers";
import { useDeleteUserPopUp } from "./useDeleteUserPopUp";
import { useQueryClient } from "@tanstack/react-query";
import { usePolicies } from "../../Policies/usePolicies";


export const useUserListPage = () => {

  const { t } = useTranslation();
  const navigate = useNavigate()
  const { service, keycloak } = useExtendedAuth()

  const policies = usePolicies()

  const { usersUserIdEdit, usersUserIdView, organizationsOrganizationIdView } = useRoutesDefinition()

  const userDisable = useUserDisable2({
    apiUrl: i2Config().userUrl,
    jwt: keycloak.token
  })

  const getRowLink = useCallback(
    (row: Row<User>): LinkProps => ({
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
    async (user: User) => {
      await userDisable.mutateAsync({
        id: user.id,
        anonymize: true
      })
      queryClient.invalidateQueries({ queryKey: ["userRefList"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user"] })
    }, []
  )

  const base = useUserColumns({
    hasOrganizations: true,
    getOrganizationUrl,
  })

  const columns = useMemo((): G2ColumnDef<User>[] => {

    const columns: G2ColumnDef<User>[] = [
      base.columns.givenName, {
        header: t("role"),
        id: "role",
        cell: ({ row }) => {
          if (!row.original.roles) return
          return <Chip label={t("roles." + row.original.roles[0])} color={getUserRoleColor(row.original.roles[0])} />;
        },
      },
      ...(policies.user.canListAllUser ? [
        base.columns.memberOf as G2ColumnDef<User>
      ] : []),
      base.columns.email
    ]

    if (service.is_im_user_write()) {
      columns.push({
        header: t("actions"),
        id: "actions",
        cell: ({ row }) => {
          const declineConfirmation = useDeleteUserPopUp({ onDeleteClick: onDeleteClick })
          const handleDeleteClick = useCallback(
            (user: User) => {
              declineConfirmation.open(user);
            },
            [declineConfirmation]
          );

          return <><TableCellAdmin onDelete={() => handleDeleteClick(row.original)} onEdit={() => navigate(usersUserIdEdit(row.original.id))} />{declineConfirmation.popup}</>
        },
      })
    }
    return columns
  }, [service.getPrincipalRole, base.columns, policies.user.canListAllUser])

  return {
    getRowLink: getRowLink,
    columns
  }
}