import { Typography } from "@mui/material"
import { CheckBox, ColumnFactory, useTable,  } from "@smartb/g2"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { OffsetPagination, OffsetTable, OffsetTableProps, PageQueryResult } from "template"
import { FileDTO } from "../../api"
import { Row } from '@tanstack/react-table';
import { Folder, PictureAsPdf } from "@mui/icons-material"
import { TableCellFileName } from "components"


const useFileListColumn = (onFileSelected?: (file: Row<FileDTO>) => void) => {
    const { t } = useTranslation()
    
    return useMemo(() => ColumnFactory<FileDTO>({
        generateColumns: (generators) => ({
            name: ({
                header: t("name"),
                cell: ({row}) => {

                    return row.original.isDirectory
                        ? <TableCellFileName icon={<Folder fontSize="small" />} text={row.original.path.directory} />
                        : <TableCellFileName icon={<PictureAsPdf fontSize="small" />} text={row.original.path.name} />
                        
                }
            }),
            lastModification: generators.date({
                header: t("lastModificationDate"),
                getCellProps: (file) => ({
                    date: file.lastModificationDate
                })
            }),
            size: generators.number({
                header: t("size"),
                getCellProps: (file) => ({
                    value: file.size
                })
            }),
            vectorized: generators.text({
                header: t("vectorized"),
                getCellProps: (file) => ({
                    value: file.vectorized ? t("yes") : t("no")
                })
            }),
            // @ts-ignore
            action: ({
                cell: ({row}) => {
                    return <CheckBox checked={false} onChange={() => onFileSelected && onFileSelected(row)} />
                }
            })
        })
    }), [])
}

export interface FileListTableProps extends Partial<OffsetTableProps<FileDTO>> {
    page?: PageQueryResult<FileDTO>
    isLoading?: boolean
    pagination: OffsetPagination
    onRowClicked: (row: Row<FileDTO>) => void
    selectedFile?: FileDTO | undefined
    fileSelected?: (file: Row<FileDTO>) => void
}



export const FileListTable = (props: FileListTableProps) => {
    const {page, isLoading, pagination, onRowClicked, selectedFile, fileSelected, sx, header, ...other} = props
    const { t } = useTranslation()

    const columns = useFileListColumn(fileSelected)

    const tableState= useTable({
        data: page?.items ?? [],
        columns: columns
    })

    const additionalRowsProp = useMemo(() => selectedFile ? ({ [selectedFile.id]: { className: "selectedRow" } }) : undefined, [selectedFile])

    return (
        (isLoading || page?.items) ? <OffsetTable<FileDTO>
            {...other} 
            tableState={tableState} 
            pagination={pagination}
            page={page}
            isLoading={isLoading}
            onRowClicked={onRowClicked}
            additionalRowsProps={additionalRowsProp}
        /> : <Typography align="center">{t("fileList.noFiles")}</Typography> 
    )

}