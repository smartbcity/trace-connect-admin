import { useTranslation } from "react-i18next";
import {LinkProps, useNavigate} from "react-router-dom";
import {TableCellAdmin, getOrgRolesOptions, useExtendedAuth, useRoutesDefinition} from "components";
import {Organization, useOrganizationDisable2} from "@smartb/g2-i2-v2";
import {useCallback, useMemo} from "react";
import {Row} from "@tanstack/react-table";
import {useQueryClient} from "@tanstack/react-query";
import {G2ColumnDef} from "@smartb/g2-layout";
import {i2Config} from "@smartb/g2-providers";
import {useDeleteOrganizationPopUp} from "./useDeleteOrganizationPopUp";
import { useOrganizationColumns } from "@smartb/g2-i2-v2";
import { InputForm } from "@smartb/g2";


export const useOrganizationListPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const {service, keycloak} = useExtendedAuth()

    const { organizationsOrganizationIdView, organizationsOrganizationIdEdit} = useRoutesDefinition()

    const orgDisable = useOrganizationDisable2({
        apiUrl : i2Config().orgUrl,
        jwt : keycloak.token
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
                    return <InputForm inputType="select" value={(row.original.roles ?? [])[0]} readOnly readOnlyType="chip" options={getOrgRolesOptions(t)} />
                },
            },
            base.columns.address,
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
    }, [service.getPrincipalRole, base.columns])

    return {
        getRowLink: getRowLink,
        columns
    }
}