
export interface PathDTO {
    name: string,
    objectType: string,
    objectId: string
    directory: string 
}

export interface FileDTO {
    id: string,
    size: number,
    path: PathDTO,
    pathStr: string,
    url: string,
    lastModificationDate: number,
    vectorized: boolean,
    isDirectory: boolean
}