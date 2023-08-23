import { Page, Section, Button } from "@smartb/g2";
import { PageHeaderObject } from "components";
import { useTranslation } from "react-i18next";
import { FileListTable } from "../../components";
import { useCallback, useMemo, useState } from "react";
import { useFileListPageQueryFunction } from "../../api/query/page";
import { Offset } from "template";
import { FileDTO } from "../../api";
import { Row } from '@tanstack/react-table';


export interface FileListPageProps {

}

export const FileListPage = (props: FileListPageProps) => {
    const {} = props;
    const [clickedRow, setClickedRow] = useState<FileDTO | undefined>(undefined)
    const [selectedFile, setFile] = useState<FileDTO | undefined>(undefined)

    const { t } = useTranslation()

    
    const fileListPageQuery = useFileListPageQueryFunction({
        query: {
            objectType: clickedRow?.path.objectType!,
            objectId: clickedRow?.path.objectId!,
            directory: clickedRow?.path.directory!,
            recursive: "false",
        }
    })

    const fileSelected = useCallback(
        (row: Row<FileDTO>) => {
            setFile(file => file?.id === row.original.id ? undefined : row.original)
        },
        []
    )
    
    const onRowClicked = useCallback(
        (row: Row<FileDTO>) => {
            setClickedRow(row.original);
        }, 
        []
    )
    
    const fileListPage = useMemo(() => {
        const fileList = fileListPageQuery?.data?.items ?? []
        return {
            total: fileList.length,
            items: fileList
        } 
    }, [fileListPageQuery?.data?.items])

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
                        <></>
                      ],
                      rightPart: [
                        <Button key="pageAddButton">{t("download")}</Button>,
                        <Button key="pageAddButton">{t("delete")}</Button>
                      ]
                    }]
                  }}
            >
                <FileListTable 
                    isLoading={fileListPageQuery.isLoading}
                    page={fileListPage}
                    pagination={pagination}
                    onRowClicked={onRowClicked}
                    selectedFile={selectedFile}
                    fileSelected={fileSelected}
                />
            </Section>
        </Page>
    )
}