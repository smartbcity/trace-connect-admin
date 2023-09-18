import {CommandParams, FilePath, useCommandRequest } from "@smartb/g2";
import {useAuthenticatedRequest} from "../../../Apikeys/config";


export type FileDeleteCommand = Partial<FilePath>
export type FileDeleteEvent = FilePath & { id: string }

export const useFileDeleteCommand = (params?:  CommandParams<FileDeleteCommand, FileDeleteEvent>) => {
    const requestProps = useAuthenticatedRequest("fs")
    return useCommandRequest<FileDeleteCommand, FileDeleteEvent>(
        "fileDelete", requestProps, params
    )
}
