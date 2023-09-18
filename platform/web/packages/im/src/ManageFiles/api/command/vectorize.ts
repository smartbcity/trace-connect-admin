import {CommandParams, FilePath, useCommandRequest } from "@smartb/g2";
import {useAuthenticatedRequest} from "../../../Apikeys/config";


type FileVectorizeCommand = { 
    path: FilePath 
}
type FileVectorizedEvent = FilePath

export const useFileVectorizeCommand = (params?:  CommandParams<FileVectorizeCommand, FileVectorizedEvent>) => {
    const requestProps = useAuthenticatedRequest("fs")
    return useCommandRequest<FileVectorizeCommand, FileVectorizedEvent>(
        "fileVectorize", requestProps, params
    )
}
