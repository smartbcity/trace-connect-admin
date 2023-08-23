import { Stack, Typography } from "@mui/material"



export interface TableCellFileNameProps {
    icon: React.ReactNode
    text: string
}

export const TableCellFileName = (props: TableCellFileNameProps) => {
    const { icon, text } = props
    
    return (
        <Stack direction="row"
               alignItems="center"
               gap={1}
        >
            {icon}
            <Typography>{text}</Typography>
        </Stack>
    )
}
