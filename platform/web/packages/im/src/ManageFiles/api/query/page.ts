import { QueryParams, useQueryRequest } from "@smartb/g2"
import { useAuthenticatedRequest } from "../../../Apikeys/config"
import { FileDTO } from "../model"


export interface FileListQuery {
    objectType: string,
    objectId: string,
    directory: string,
    recursive: string
}


export interface FileListResult {
    total: number
    items: FileDTO[]
}

export const useFileListPageQueryFunction = (params: QueryParams<FileListQuery, FileListResult>) => {
    const requestProps = useAuthenticatedRequest("fs")
    return useQueryRequest<FileListQuery, FileListResult>(
      "fileList", requestProps, params
    )
}

