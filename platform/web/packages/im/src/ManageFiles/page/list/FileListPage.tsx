import { Page, Section, Button, FormComposableField, FormComposable, useFormComposable } from "@smartb/g2";
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
import { useGoto } from '../../../../../web-app/src/App/routes/goto'
import { useParams } from "react-router-dom";
import { useFileVectorizeCommand } from "../../api/command/vectorize";
import { useFileUploadCommand } from "../../api/command/upload";
import { useFileUploadPopUp } from "../../hooks/useFileUploadPopUp";


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


    const fileListPageQuery = useFileListPageQueryFunction({
        query: { objectType, objectId, directory, recursive: "false", }
    })
    
    const downloadFile = useFileDownloadQuery()
    const fileDeleteCommand = useFileDeleteCommand()
    const fileVectorizeCommand = useFileVectorizeCommand()
    const fileUploadCommand = useFileUploadCommand()
    
    
    const getFileUrl = async () => {
        const url = await downloadFile({ objectType, objectId, directory, name: `${name}.pdf`, })
        if(url) {
            setPdfFileUrl(url)
        }
    }

    useEffect(() => { if(name) { getFileUrl() } }, [name])
    
    const onDelete = useCallback(
        async(file: FileDTO) => {
            const result = await fileDeleteCommand.mutateAsync(file.path)
            if(result) {
                fileListPageQuery.refetch()
            }
        },
        [fileDeleteCommand.mutateAsync, fileListPageQuery.refetch]
    )
    const onVectorize = useCallback(
        async(file: FileDTO) => {
            const result = await fileVectorizeCommand.mutateAsync({path: file.path})
            if(result) {
                fileListPageQuery.refetch()
            }
        }, 
        [fileDeleteCommand.mutateAsync, fileListPageQuery.refetch]
    )
    const onDownload = useCallback(
        async(file: FileDTO) => {
            const url = await downloadFile(file.path)
            if(url) {
                const link = document.createElement('a')
                link.href = url
                link.download = file.path.name,
                link.click()
                setPdfFileUrl(url)
                return url;
            }
    }, [downloadFile])

    const onRowClicked = useCallback(
        (row: Row<FileDTO>) => {
            if(row.original.path.name) {
                // prevent the browser to fetch the file directly from the server
                goto.fileView(row.original.pathStr.slice(0, -4)) 
            }else goto.fileView(row.original.pathStr)
        }, 
        []
    )
    
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
        disabled: !formState.values.uploadFile,
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
                title: t("manageFiles"),
                rightPart: [
                    <Button key="uploadButton" sx={{color: "white"}} onClick={() => setUploadOpen(true)} disabled={!directory || !!name} > {t("uploadFile")} </Button>,
                ]
            })}
        >

            <Section
                flexContent
                sx={{background: "transparent"}}
                headerProps={{
                    sx:{ background: 'transparent' },
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
                        onDownload={onDownload}
                        onVectorize={onVectorize}
                        onDelete={onDelete}
                    />
                }
                </Stack>
            </Section>
            {uploadPopup}
        </Page>
    )
}
