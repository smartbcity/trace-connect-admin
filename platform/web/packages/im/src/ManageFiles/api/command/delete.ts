import {CommandParams, FilePath, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../../Apikeys/config";
import { PathDTO } from "../model";


interface FileDeleteEventDTO {
    id: string,
    path: PathDTO
}

export interface FileDeleteCommand extends FilePath{ }
export interface FileDeleteEvent extends  FileDeleteEventDTO{ }

export type ApiKeyAddFunctionOptions = Omit<CommandParams<FileDeleteCommand, FileDeleteEvent>,
    'jwt' | 'apiUrl'
>

export const useFileDeleteCommand = (params?:  CommandParams<FileDeleteCommand, FileDeleteEvent>) => {
    const requestProps = useAuthenticatedRequest("fs")
    return useCommandRequest<FileDeleteCommand, FileDeleteEvent>(
        "fileDelete", requestProps, params
    )
}
