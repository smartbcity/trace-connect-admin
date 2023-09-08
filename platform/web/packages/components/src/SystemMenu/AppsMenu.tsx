import React, { useMemo } from 'react'
import { Box, BoxProps } from '@mui/material'
import { AppButton } from './AppButton'
import {Tooltip} from "@smartb/g2"

export interface SystemApp {
    href: string
    label: string
    icon: React.ReactNode
    description?: string
}

export interface AppsMenuProps extends BoxProps {
    apps: SystemApp[]
}

export const AppsMenu = (props: AppsMenuProps) => {
    const { apps, sx, ...other } = props

    const appsDisplay = useMemo(() => apps.map((app) => {
        const btn = (
            <AppButton
                key={app.href}
                href={app.href}
                startIcon={app.icon}
            >
                {app.label}
            </AppButton>
        )
        return app.description ? (
            <Tooltip
            helperText={app.description}
            sx={{
                background: "#666560"
            }}
            >
                {btn}
                </Tooltip>
        ) : btn
    }), [apps])

    return (
        <Box
            {...other}
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                justifyContent: "space-between",
                padding: "20px",
                ...sx
            }}
        >
            {appsDisplay}
        </Box>
    )
}
