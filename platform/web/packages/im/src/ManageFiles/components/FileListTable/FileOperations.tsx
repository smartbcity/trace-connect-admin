import { PictureAsPdfOutlined, TextSnippetOutlined, FolderOutlined, FmdGoodOutlined } from "@mui/icons-material"
import { FileDTO } from "../../api"

export const formatFileSize = (bytes: number) => {
    if(bytes < 1024) return `${bytes} K`
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' Kb'
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' Mb'
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' Gb'
}

export const getFolderName = (folder: FileDTO) => {
    if(!!folder.path.directory) return folder.path.directory
    else if(folder.path.objectId) return folder.path.objectId;
    else return folder.path.objectType
}


export const getFileIcon = (extension: string | undefined) => {
    switch(extension) {
        case 'pdf':
            return <PictureAsPdfOutlined fontSize="small" />;
        case 'txt':
            return <TextSnippetOutlined fontSize="small" />;
        case 'kml':
            return <FmdGoodOutlined fontSize="small" />
        default:
            return <FolderOutlined fontSize="small" />;
    }
}

export const getFileExtension = (filename: string): string | undefined => {
    if(filename.lastIndexOf(".") === -1) undefined
    return filename.substring(filename.lastIndexOf(".") + 1)
}