import { Drawer, DrawerProps, Stack, IconButton, Box } from '@mui/material'
import { Apps } from "@mui/icons-material"
import { AppsMenu, SystemApp } from './AppsMenu'
import { TraceIcon } from '../icons'

export interface SystemMenuProps extends DrawerProps {
    apps: SystemApp[]
    onCloseDrawer?: () => void
}

export const SystemMenu = (props: SystemMenuProps) => {
    const { apps, sx, onCloseDrawer, ...other } = props
    return (
        <Drawer
            {...other}
            sx={{
                maxWidth: "330px",
                width: "100vw"
            }}
        // PaperProps={{
        //     sx: {
        //         display: "flex",
        //         gap: (theme) => theme.spacing(4)
        //     },
        // }}
        >
            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                    padding: "16px",
                    gap: "16px",
                    alignItems: "center",
                }}
            >
                <IconButton
                    onClick={onCloseDrawer}
                >
                    <Apps />
                </IconButton>
                <TraceIcon style={{ width: "100%", height: "40px" }} />
                <Box />
            </Stack>
            <AppsMenu apps={apps} />
        </Drawer>
    )
}
