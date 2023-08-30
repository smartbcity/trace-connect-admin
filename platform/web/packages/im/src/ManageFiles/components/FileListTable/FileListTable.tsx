import { Typography } from "@mui/material"
import { ColumnFactory, useTable, } from "@smartb/g2"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { OffsetPagination, OffsetTable, PageQueryResult } from "template"
import { FileDTO } from "../../api"
import { Row, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { TableCellFileName } from "components"
import { getFolderName, formatFileSize, getFileIcon, getFileExtension } from "./FileOperations"

const useFileListColumn = () => {
    const { t } = useTranslation()

    return useMemo(() => ColumnFactory<FileDTO>({
        generateColumns: (generators) => ({
            name: ({
                header: t("name"),
                cell: ({ row }) => {
                    const file = row.original
                    const extension = !file.isDirectory ? getFileExtension(file.path.name) : undefined
                    const icon = getFileIcon(extension)
                    return <TableCellFileName icon={icon} text={file.isDirectory ? getFolderName(file) : file.path.name} />
                }
            }),
            lastModification: generators.date({
                header: t("lastModificationDate"),
                getCellProps: (file) => ({
                    date: file.lastModificationDate
                })
            }),
            size: generators.text({
                header: t("size"),
                getCellProps: (file) => ({
                    value: !file.isDirectory ? formatFileSize(file.size) : ""
                })
            }),
            vectorized: generators.text({
                header: t("vectorized"),
                getCellProps: (file) => ({
                    value: file.vectorized ? t("yes") : t("no")
                })
            })
        })
    }), [t])
}

export interface FileListTableProps {
    page?: PageQueryResult<FileDTO>
    isLoading?: boolean
    pagination: OffsetPagination
    onRowClicked: (row: Row<FileDTO>) => void
    rowSelection?: RowSelectionState,
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export const FileListTable = (props: FileListTableProps) => {
    const { page, isLoading, pagination, onRowClicked, rowSelection, onRowSelectionChange } = props
    const { t } = useTranslation()

    const columns = useFileListColumn()

    const tableState = useTable({
        data: page?.items ?? [],
        columns: columns,
        state: {
            rowSelection
        },
        enableRowSelection: true,
        onRowSelectionChange: onRowSelectionChange
    })


    return (
        (isLoading || page?.items) ? <OffsetTable<FileDTO>
            tableState={tableState}
            pagination={pagination}
            page={page}
            isLoading={isLoading}
            onRowClicked={onRowClicked}
        /> : <Typography align="center">{t("fileList.noFiles")}</Typography>
    )

}
