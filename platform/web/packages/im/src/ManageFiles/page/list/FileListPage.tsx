import { Page, Section, Button } from "@smartb/g2";
import { PageHeaderObject } from "components";
import { useTranslation } from "react-i18next";
import { FileListTable } from "../../components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFileListPageQueryFunction } from "../../api/query/page";
import { Offset, PageQueryResult } from "template";
import { FileDTO } from "../../api";
import { Row, RowSelectionState } from '@tanstack/react-table';
import { useFileDownloadQuery } from "../../api/query/get";
import { useFileDeleteCommand } from "../../api/command/delete";
import { Breadcrumbs, Link, Stack } from "@mui/material";
import { NavigateNext } from "@mui/icons-material"
import { PdfDisplayer } from "../../../PdfDisplayer";
import { getFileExtension } from "../../components/FileListTable/FileOperations";
import { useGoto } from '../../../../../web-app/src/App/routes/goto'
import { useParams } from "react-router-dom";

export const FileListPage = () => {
    const [clickedRow, setClickedRow] = useState<FileDTO | undefined>(undefined)
    const [selectedFiles, setSelectedFiles] = useState<FileDTO[]>([]);
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pdfFileUrl, setPdfFileUrl] = useState<string | undefined>(undefined)

    const goto = useGoto()
    const {'*': params} = useParams()
    const [objectType, objectId, directory, name] = (params || '').split('/')

    const fileListPageQuery = useFileListPageQueryFunction({
        query: { objectType, objectId, directory, recursive: "false", }
    })
    
    const downloadFile = useFileDownloadQuery()
    const fileDeleteCommand = useFileDeleteCommand()
    
    const handleFileAction = useCallback(async (actionType: string) => {
        const isFileSelected = !!selectedFiles.length && !selectedFiles[0].isDirectory

        if(name || isFileSelected) {
            const filePath = name ? {objectType, objectId, directory, name: `${name}.pdf`} : selectedFiles[0].path

            if(actionType === 'download') {
                const url = await downloadFile(filePath!)
                if(url) {
                    const link = document.createElement('a')
                    link.href = url
                    link.download = filePath!.name,
                    link.click()
                    setRowSelection({})
                    setPdfFileUrl(url)
                    return url;
                }
            
            } else if(actionType === 'delete') {
                const result = await fileDeleteCommand.mutateAsync(filePath!)
                if(result) {
                    fileListPageQuery.refetch()
                    setRowSelection({})
                }
            }
        }
    }, [selectedFiles, fileListPageQuery.refetch, fileDeleteCommand.mutateAsync, clickedRow, downloadFile])
   
    
    const getFileUrl = async () => {
        const url = await downloadFile({ objectType, objectId, directory, name: `${name}.pdf`, })
        if(url) {
            setPdfFileUrl(url)
        }
    }

    useEffect(() => { if(name) { getFileUrl() } }, [name])
    
    const onRowClicked = useCallback(
        (row: Row<FileDTO>) => {
            setClickedRow(row.original);
            if(row.original.path.name) {
                // prevent the browser to fetch the file directly from the server
                goto.fileView(row.original.pathStr.slice(0, -4)) 
            }else goto.fileView(row.original.pathStr)
        }, 
        []
    )
    
    const fileListPage: PageQueryResult<FileDTO> = useMemo(() => {
        const fileList = fileListPageQuery?.data?.items ?? []
        return {
            total: 0, // Hide the pagination bar
            items: fileList
        } 
    }, [fileListPageQuery?.data?.items])
    
    useEffect(() => {
        const selectedRows = Object.keys(rowSelection).filter(key => rowSelection[key]).map(key => parseInt(key));
        const updatedSelectedFiles = fileListPage.items.filter((_, index) => selectedRows.includes(index));

        setSelectedFiles(updatedSelectedFiles);
    }, [rowSelection, fileListPage.items]);

    
    const handleBreadcrumbClick = (index: number) => {
        if(index + 1 !== params?.split('/').length) {
            setPdfFileUrl(undefined)
            const _pathStr = params?.split('/')
            _pathStr?.splice(index + 1)
            goto.fileView(_pathStr?.join('/')!)
        }
    }
      
    const breadcrumbs = useMemo(() => {
        if(true) {
            return params?.split('/').map((el, index )=> (
                <Link key={index} sx={{ cursor: 'pointer', fontSize: 12 }} color="secondary"  onClick={() => handleBreadcrumbClick(index)} >{el}</Link>    
            ))
        }
    }, [params])

    const pagination = useMemo(() => ({
        offset: Offset.default.offset, limit: Offset.default.limit
    }), [])

    const isClickedFileAPdf = clickedRow && !clickedRow.isDirectory && getFileExtension(clickedRow.path.name) == "pdf"
    return(
        <Page
            headerProps={PageHeaderObject({
                title: t("manageFiles")
            })}
        >

            <Section
                flexContent
                headerProps={{
                    content: [{
                      leftPart: [ 
                        <Breadcrumbs
                            separator={<NavigateNext fontSize="small" />}
                            aria-label="breadcrumb"
                            sx={{userSelect: 'none'}}
                            >
                            {breadcrumbs}
                        </Breadcrumbs>
                      ],
                      rightPart: [
                        <Button key="downloadButton" onClick={() => handleFileAction('download')} disabled={!selectedFiles.length && !pdfFileUrl}>{t("download")}</Button>,
                        <Button key="deleteButton" onClick={() => handleFileAction('delete')} disabled={!selectedFiles.length && !pdfFileUrl}>{t("delete")}</Button>
                      ]
                    }]
                  }}
            >
                <Stack
                    height="calc(100vh - 220px)"
                >
                {name ? <PdfDisplayer file={pdfFileUrl} /> :
                    <FileListTable
                        isLoading={fileListPageQuery.isLoading}
                        page={fileListPage}
                        pagination={pagination}
                        onRowClicked={onRowClicked}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                    />
                }
                </Stack>
            </Section>
        </Page>
    )
}
