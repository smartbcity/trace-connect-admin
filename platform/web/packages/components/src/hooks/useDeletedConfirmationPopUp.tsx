import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import { Action, PopUp } from "@smartb/g2";
import { Typography } from "@mui/material";

export interface UseDeletedConfirmationProps {
    title: string
    component?: React.ReactNode
    onDelete: () => void
}

export interface UseDeletedConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    setOpen: (open: boolean) => void
    handleOpen: () => void
    handleClose: () => void
}

export const useDeletedConfirmationPopUp = (props: UseDeletedConfirmationProps): UseDeletedConfirmationType => {
    const {  title, component, onDelete  } = props
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
        key: "delete",
        label: t("delete"),
        color: "error",
        onClick: onDelete,
    }], [handleClose, t, onDelete])


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