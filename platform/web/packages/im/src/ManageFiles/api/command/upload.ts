import {CommandParams, CommandWithFile, FilePath, useCommandWithFileRequest } from "@smartb/g2";
import {useAuthenticatedRequest} from "../../../Apikeys/config";

export interface MetaDataDTO {
    Pragma: string
    'Content-Type': string
    secret: string
}

export type FileUploadCommand = { path: FilePath } & { vectorize: boolean } 
export interface FileUploadEvent {
    id: string
    path: FilePath
    url: string
    hash: string
    metadata: MetaDataDTO,
    time: number
}

export const useFileUploadCommand = (params?:  CommandParams<CommandWithFile<FileUploadCommand>, FileUploadEvent>) => {
    const requestProps = useAuthenticatedRequest("fs")
    return useCommandWithFileRequest<FileUploadCommand, FileUploadEvent>(
        "fileUpload", requestProps, params
    )
}
