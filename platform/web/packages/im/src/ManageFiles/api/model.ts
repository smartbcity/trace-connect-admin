
export interface PathDTO {
    name: string,
    objectType: string,
    objectId: string
    directory: string 
}

export interface FileDTO {
    id: string,
    size: number,
    path: PathDTO
    lastModificationDate: number,
    vectorized: boolean,
    isDirectory: boolean
}