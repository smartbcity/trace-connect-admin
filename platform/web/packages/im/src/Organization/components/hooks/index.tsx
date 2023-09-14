import { useTranslation } from "react-i18next";
import {LinkProps, useNavigate} from "react-router-dom";
import {TableCellAdmin, getOrgRolesOptions, useExtendedAuth, useRoutesDefinition} from "components";
import {Organization, useOrganizationDisable} from "connect-im";
import {useCallback, useMemo} from "react";
import {Row} from "@tanstack/react-table";
import {useQueryClient} from "@tanstack/react-query";
import {G2ColumnDef} from "@smartb/g2-layout";
import {useDeleteOrganizationPopUp} from "./useDeleteOrganizationPopUp";
import { useOrganizationColumns } from "connect-im";
import { Chip, InputForm, useTheme } from "@smartb/g2";


export const useOrganizationListPage = () => {

    const { t , i18n} = useTranslation();
    const navigate = useNavigate()
    const {service, roles} = useExtendedAuth()

    const { organizationsOrganizationIdView, organizationsOrganizationIdEdit} = useRoutesDefinition()
    const theme = useTheme()

    const orgDisable = useOrganizationDisable({
    })

    const getRowLink = useCallback(
        (row: Row<Organization>) : LinkProps => ({
            to: organizationsOrganizationIdView(row.original.id)
        }),
        [organizationsOrganizationIdView()],
    )

    const queryClient = useQueryClient()

    const onDeleteClick = useCallback(
        async (organization : Organization) => {
            await orgDisable.mutateAsync({
                id: organization.id,
                anonymize: true
            })
            queryClient.invalidateQueries({ queryKey: ["organizationRefList"] })
            queryClient.invalidateQueries({ queryKey: ["organizations"] })
            queryClient.invalidateQueries({ queryKey: ["organization"] })
        }, []
    )

    const base = useOrganizationColumns()

    const columns = useMemo((): G2ColumnDef<Organization>[] => {
        return [
            base.columns.name,
            {
                header: t("role"),
                id: "roles",
                cell: ({row}) => {
                    //@ts-ignore
                    return <InputForm inputType="select" value={(row.original.roles ?? [])[0]?.identifier} readOnly readOnlyType="chip" options={getOrgRolesOptions(i18n.language, roles)} />
                },
            },
            base.columns.address,
            {
                header: t("status"),
                id: "status",
                cell: ({row}) => {
                    //@ts-ignore
                    const status = row.original.status
                    if (!status) return <></>
                    return <Chip
                    label={t("organizationStatus." + status)}
                    color={status === "VERIFIED" ? theme.colors.success : status === "WAITING" ? theme.colors.warning : theme.colors.error}
                    />
                },
            },
            {
            header: t("actions"),
            id: "delete",
            cell: ({row}) => {
                const declineConfirmation = useDeleteOrganizationPopUp({onDeleteClick : onDeleteClick})

                const handleDeleteClick = useCallback(
                    (organization : Organization) => {
                        declineConfirmation.open(organization);
                    },
                    [declineConfirmation]
                );
                return <><TableCellAdmin onDelete={() => handleDeleteClick(row.original)} onEdit={() => navigate(organizationsOrganizationIdEdit(row.original.id))} />{declineConfirmation.popup}</>
            },
        },
        ]
    }, [service.getPrincipalRole, base.columns, i18n.language, t, roles])

    return {
        getRowLink: getRowLink,
        columns
    }
}