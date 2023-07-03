import {useMemo} from "react";
import {
    ColumnFactory,
    useTable
} from "@smartb/g2";
import {TableCellAdmin} from "components";
import {useTranslation} from "react-i18next";
import {Typography} from "@mui/material";
import {OffsetPagination, OffsetTable, PageQueryResult} from "template";
import {useDeleteAPIKeyPopUp} from "./useDeleteAPIKeyPopUp";
import {ApiKeyDTO} from "../../api";
function useAPIKeyColumn(onDeleteClick : (apiKey : ApiKeyDTO)  => Promise<void>) {
    const { t } = useTranslation();
    return useMemo(() => ColumnFactory<ApiKeyDTO>({
        generateColumns: (generators) => ({
            name: generators.text({
                header: t("name"),
                getCellProps: (registry) => ({
                    value: registry.name
                })
            }),
            identifier: generators.text({
                header: t("identifier"),
                getCellProps: (registry) => ({
                    value: registry.identifier
                })
            }),

            date: generators.date({
                header: t("created"),
                getCellProps: (registry) => ({
                    date: registry.creationDate
                })
            }),
            // @ts-ignore
            action : ({
                cell: ({row}) => {
                    const popUp = useDeleteAPIKeyPopUp({onDeleteClick : onDeleteClick, apiKey : row.original})
                    return <><TableCellAdmin onDelete={() => popUp.open()}/>{popUp.popup}</>
                }
            })
        })
    }), [t]);
}

export interface APIKeysTableProps{
    page?: PageQueryResult<ApiKeyDTO>
    pagination: OffsetPagination
    isLoading?: boolean
    onDeleteClick: (apiKey : ApiKeyDTO) => Promise<void>
}

export const APIKeysTable = (props: APIKeysTableProps) => {
    const {  page, isLoading, pagination, onDeleteClick} = props
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
                />
        )
}
