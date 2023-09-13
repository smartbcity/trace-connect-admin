import { useMemo } from "react";
import { Chip, ColumnFactory, useTable } from "@smartb/g2";
import { TableCellAdmin, getUserRoleColor } from "components";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
import { OffsetPagination, OffsetTable, PageQueryResult } from "template";
import { useDeleteAPIKeyPopUp } from "./useDeleteAPIKeyPopUp";
import { ApiKeyDTO } from "../../api";
function useAPIKeyColumn(onDeleteClick: (apiKey: ApiKeyDTO) => Promise<void>) {
    const { t, i18n } = useTranslation();
    return useMemo(() => ColumnFactory<ApiKeyDTO>({
        generateColumns: (generators) => ({
            name: generators.text({
                header: t("name"),
                getCellProps: (apiKey) => ({
                    value: apiKey.name
                })
            }),
            identifier: generators.text({
                header: t("identifier"),
                getCellProps: (apiKey) => ({
                    value: apiKey.identifier
                })
            }),
            roles: {
                id: 'roles',
                header: t("role"),
                cell: ({ row }) => {
                    return (
                        <Stack
                            direction="row"
                            gap={1}
                        >
                            {
                                row.original.roles?.map((role) => (
                                    <Chip
                                    key={role.identifier} 
                                    label={role.locale[i18n.language]}
                                    color={getUserRoleColor(role.identifier)}
                                    />
                                ))
                            }

                        </Stack>
                    )
                }
            },
            date: generators.date({
                header: t("created"),
                getCellProps: (apiKey) => ({
                    date: apiKey.creationDate
                })
            }),
            // @ts-ignore
            action: ({
                cell: ({ row }) => {
                    const popUp = useDeleteAPIKeyPopUp({ onDeleteClick: onDeleteClick, apiKey: row.original })
                    return <><TableCellAdmin onDelete={() => popUp.open()} />{popUp.popup}</>
                }
            })
        })
    }), [t, i18n.language]);
}

export interface APIKeysTableProps {
    page?: PageQueryResult<ApiKeyDTO>
    pagination: OffsetPagination
    isLoading?: boolean
    onDeleteClick: (apiKey: ApiKeyDTO) => Promise<void>
    onOffsetChange?: (newPage: OffsetPagination) => void
}

export const APIKeysTable = (props: APIKeysTableProps) => {
    const { page, isLoading, pagination, onDeleteClick, onOffsetChange } = props
    const { t } = useTranslation()
    const columns = useAPIKeyColumn(onDeleteClick)
    const tableState = useTable({
        data: page?.items ?? [],
        columns: columns,
    })

    return (
        (!page?.items && !isLoading) ?
            <Typography align="center">{t("apiKeysList.noKeys")}</Typography>
            :
            <OffsetTable<ApiKeyDTO>
                tableState={tableState}
                page={page}
                pagination={pagination}
                isLoading={isLoading}
                onOffsetChange={onOffsetChange}
            />
    )
}
