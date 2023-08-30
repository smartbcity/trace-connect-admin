import { QueryParams, useFetchBinary, useQueryRequest } from "@smartb/g2"
import { useAuthenticatedRequest } from "../../../Apikeys"
import { FileDTO } from "../model"


export interface FileDownloadQuery {
    objectType: string,
    objectId: string,
    directory: string,
    name: string
}

export interface FileDownloadResult {
    content: any
}

export interface FileGetQuery extends FileDownloadQuery {  }

export interface FileGetResult {
    item: FileDTO
}


export const useFileDownloadQuery = (): (query: FileDownloadQuery) => Promise<string | undefined> => {
    const requestProps = useAuthenticatedRequest("fs")
    return useFetchBinary<FileDownloadQuery>(
        "fileDownload", requestProps
    )
}

export const useFileGetQuery = (params: QueryParams<FileGetQuery, FileGetResult>) => {
    const requestProps = useAuthenticatedRequest("fs")
    return useQueryRequest<FileGetQuery, FileGetResult>(
      "fileGet", requestProps, params
    )
}