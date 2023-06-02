import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import { Action, PopUp } from "@smartb/g2";
import { Typography } from "@mui/material";

export interface UseDeletedConfirmationProps {
    title: string
    description: string
    component?: React.ReactNode
}

export interface UseDeletedConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    setOpen: (open: boolean) => void
    handleOpen: () => void
    handleClose: () => void
}

export const useDeletedConfirmationPopUp = (props: UseDeletedConfirmationProps): UseDeletedConfirmationType => {
    const {  title, description, component  } = props
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
        key: "cancel",
        label: t("cancel"),
        onClick: handleClose,
        variant: "text"
    }, {
        key: "submit",
        label: t("submit"),
        color: "error",
    }], [handleClose, t])


    const popup = useMemo(() => (
        <PopUp open={isOpen} onClose={handleClose} actions={actions}>
            <Typography sx={{ whiteSpace: "pre-line" }} color="secondary" variant="h4">{title}</Typography>
            {component && <>{component}</>}
            <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{description}</Typography>
        </PopUp>
    ), [isOpen, handleClose, t, actions, component]);

    return {
        popup,
        isOpen,
        setOpen,
        handleClose,
        handleOpen
    }
}