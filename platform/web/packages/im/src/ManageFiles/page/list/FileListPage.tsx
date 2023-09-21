import { Page, Section, Button, FormComposableField, FormComposable, useFormComposable } from "@smartb/g2";
import { PageHeaderObject, useDeletedConfirmationPopUp } from "components";
import { useTranslation } from "react-i18next";
import { FileListTable } from "../../components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFileListPageQueryFunction } from "../../api/query/page";
import { Offset, PageQueryResult } from "template";
import { FileDTO } from "../../api";
import { Row, RowSelectionState } from '@tanstack/react-table';
import { useFileDownloadQuery } from "../../api/query/get";
import { useFileDeleteCommand } from "../../api/command/delete";
import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { Download, GridOn, NavigateNext, Upload } from "@mui/icons-material"
import { PdfDisplayer } from "../../../PdfDisplayer";
import { useGoto } from '../../../../../web-app/src/App/routes/goto'
import { useParams } from "react-router-dom";
import { useFileVectorizeCommand } from "../../api/command/vectorize";
import { useFileUploadCommand } from "../../api/command/upload";
import { useFileUploadPopUp } from "../../hooks/useFileUploadPopUp";

type ActionType = 'download' | 'delete' | 'vectorize' | 'upload'

export const FileListPage = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileDTO[]>([]);
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pdfFileUrl, setPdfFileUrl] = useState<string | undefined>(undefined)

    const goto = useGoto()
    const {'*': params} = useParams()
    const [objectType, objectId, directory, name] = (params || '').split('/')

    const paramsList = useMemo(() => (
        params?.length ? [t("home")].concat(params.split("/")) : [t("home")]
    ), [params])

    const canVectorize = useMemo(() => {
        return selectedFiles.some(({ vectorized }) => !vectorized)
    }, [selectedFiles])

    const fileListPageQuery = useFileListPageQueryFunction({
        query: { objectType, objectId, directory, recursive: "false", }
    })
    
    const downloadFile = useFileDownloadQuery()
    const fileDeleteCommand = useFileDeleteCommand()
    const fileVectorizeCommand = useFileVectorizeCommand()
    const fileUploadCommand = useFileUploadCommand()
    
    const handleFileAction = useCallback(async (actionType: ActionType) => {
        if(name || selectedFiles.length) {
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
                    if(name) goto.fileView(params?.substring(0, params.lastIndexOf('/'))!)
                    fileListPageQuery.refetch()
                    setRowSelection({})
                }
            } else if(actionType === 'vectorize') {
                const filePaths = name ? [{ path: filePath }] : selectedFiles.filter(file => !file.vectorized).map(file => ({ path: file.path }))
                const result = await fileVectorizeCommand.mutateAsync(filePaths)
                if(result) {
                    fileListPageQuery.refetch()
                    setRowSelection({})
                }
            }
        }
    }, [selectedFiles, fileListPageQuery.refetch, fileDeleteCommand.mutateAsync, downloadFile, objectType, objectId, directory, name, goto.fileView, fileVectorizeCommand.mutateAsync])
   
    
    const getFileUrl = async () => {
        const url = await downloadFile({ objectType, objectId, directory, name: `${name}.pdf`, })
        if(url) {
            setPdfFileUrl(url)
        }
    }

    useEffect(() => { if(name) { getFileUrl() } }, [name])
    
    const onRowClicked = useCallback(
        (row: Row<FileDTO>) => {
            if(row.original.path.name) {
                // prevent the browser to fetch the file directly from the server
                goto.fileView(row.original.pathStr.slice(0, -4)) 
            }else goto.fileView(row.original.pathStr)
        }, 
        []
    )
    
    const { popup: deletePopup, setOpen: setDeleteOpen } = useDeletedConfirmationPopUp({
        title: t("fileList.delete"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("fileList.deleteMessage")}</Typography>,
        onDelete: async () => { await handleFileAction("delete") }
    });

    const onUpload = useCallback(async (values: any) => {
        if(values && values.uploadFile) {
            const { uploadFile } = values  
            const result = await fileUploadCommand.mutateAsync({
                command: {
                    path: { objectType, objectId, directory, name: values.uploadFile.name },
                    vectorize: false
                },
                files: uploadFile ? [{file: uploadFile}] : []
            })
            if(result) {
                fileListPageQuery.refetch()
                formState.resetForm()
            }
        }
    }, [fileUploadCommand.mutateAsync, objectType, objectId, directory, fileListPageQuery.refetch])

    const formState = useFormComposable({
        onSubmit: onUpload
    })

    const uploadFileForm = useMemo((): FormComposableField[] => [{
        name: "uploadFile",
        type: "documentHandler",
        label: t("fileList.uploadFile"),
        params: {
            isRequired: true
        },
    }], [t])

    const { popup: uploadPopup, setOpen: setUploadOpen } = useFileUploadPopUp({
        title: t("fileList.uploadFile"),
        component: <FormComposable formState={formState} fields={uploadFileForm} />,
        onUpload: formState.submitForm
    })

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
        if(index + 1 !== paramsList.length) {
            setPdfFileUrl(undefined)
            const _pathStr = params?.split('/')
            _pathStr?.splice(index)
            goto.fileView(_pathStr?.join('/')!)
        }
    }
      
    const breadcrumbs = useMemo(() => {
        if(true) {
            return paramsList.map((el, index )=> (
                <Link key={index} sx={{ cursor: 'pointer', fontSize: 12 }} color="secondary"  onClick={() => handleBreadcrumbClick(index)} >{el}</Link>    
            ))
        }
    }, [params])

    const pagination = useMemo(() => ({
        offset: Offset.default.offset, limit: Offset.default.limit
    }), [])

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
                            key="files"
                            >
                            {breadcrumbs}
                        </Breadcrumbs>
                      ],
                      rightPart: [
                        <Button key="uploadButton" sx={{color: "white"}} onClick={() => setUploadOpen(true)} disabled={!directory || !!name} endIcon={<Upload />}> {t("uploadFile")} </Button>,
                        <Button key="vectorizeButton" sx={{color: "white"}} onClick={() => handleFileAction('vectorize')} disabled={!canVectorize} endIcon={<GridOn />}> {t("vectorize")} </Button>,
                        <Button key="downloadButton" sx={{color: "white"}} onClick={() => handleFileAction('download')} disabled={!selectedFiles.length && !name} endIcon={<Download />}> {t("download")} </Button>,
                        <Button key="deleteButton" fail noDefaultIcon onClick={() => setDeleteOpen(true)} disabled={!selectedFiles.length && !name}>{t("delete")}</Button>
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
            {deletePopup}
            {uploadPopup}
        </Page>
    )
}
