import { Stack, Typography } from "@mui/material"
import { ColumnFactory, useTable, } from "@smartb/g2"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { OffsetPagination, OffsetTable, PageQueryResult } from "template"
import { FileDTO } from "../../api"
import { Row, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { TableCellAdmin, TableCellFileName } from "components"
import { getFolderName, formatFileSize, getFileIcon, getFileExtension } from "./FileOperations"
import { useDeleteFilePopUp } from "../../hooks/useDeleteFilePopUp"
export interface UseFileListColumnProps {
    onDownload: (file: FileDTO) => Promise<string | undefined>
    onVectorize: (file: FileDTO) => Promise<void>
    onDelete: (file: FileDTO) => Promise<void>
}

const useFileListColumn = (props: UseFileListColumnProps) => {
    const { onDownload, onVectorize, onDelete } = props
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
                    value: file.isDirectory ? "-" : file.vectorized ? t("yes") : t("no")
                })
            }),
            // @ts-ignore
            action: ({
                cell: ({ row }) => {
                    if (row.original.isDirectory) return <></>       
                    const popUp = useDeleteFilePopUp({ onDeleteClick: onDelete, file: row.original })
                    return (
                        <Stack sx={{flexDirection: 'row'}}>
                            <TableCellAdmin onVectorize={() => onVectorize(row.original)} />
                            <TableCellAdmin onDownload={() => onDownload(row.original)} />
                            <TableCellAdmin onDelete={() => popUp.open()} />
                            {popUp.popup}
                        </Stack>
                    )
                }
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
    onDownload: (file: FileDTO) => Promise<string | undefined>
    onVectorize: (file: FileDTO) => Promise<void>
    onDelete: (file: FileDTO) => Promise<void>
}

export const FileListTable = (props: FileListTableProps) => {
    const { page, isLoading, pagination, onRowClicked, rowSelection, onRowSelectionChange, onDownload, onVectorize, onDelete } = props
    const { t } = useTranslation()

    const columns = useFileListColumn({onDownload, onVectorize, onDelete})

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
