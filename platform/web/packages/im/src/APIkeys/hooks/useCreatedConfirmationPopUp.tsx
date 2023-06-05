import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import { Action, PopUp } from "@smartb/g2";
import { Typography } from "@mui/material";

export interface useCreatedConfirmationProps {
    title: string
    component?: React.ReactNode
}

export interface useCreatedConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    setOpen: (open: boolean) => void
    handleOpen: () => void
    handleClose: () => void
}

export const useCreatedConfirmationPopUp = (props: useCreatedConfirmationProps): useCreatedConfirmationType => {
    const {  title, component  } = props
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(false)

    const handleClose = useCallback(
        () => {
            setOpen(false)
        },
        [],
    )
    const handleOpen = useCallback(
        () => {
            setOpen(true)
        },
        [],
    )

    const actions = useMemo((): Action[] => [{
        key: "close",
        label: t("close"),
        color: "primary",
    }], [handleClose, t])


    const popup = useMemo(() => (
        <PopUp open={isOpen} onClose={handleClose} actions={actions}>
            <Typography sx={{ whiteSpace: "pre-line" }} color="secondary" variant="h4">{title}</Typography>
            {component && <>{component}</>}
        </PopUp>
    ), [isOpen, handleClose, t, actions, component, title]);

    return {
        popup,
        isOpen,
        setOpen,
        handleClose,
        handleOpen
    }
}