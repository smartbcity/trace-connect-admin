import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import { Action, PopUp } from "@smartb/g2";
import { Typography } from "@mui/material";

export interface UseDeletedConfirmationProps {
    title: string
    component?: React.ReactNode
    onDelete: () => Promise<void>
}

export interface UseDeletedConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    setOpen: (open: boolean) => void
    open: () => void
    close: () => void
}

export const useDeletedConfirmationPopUp = (props: UseDeletedConfirmationProps): UseDeletedConfirmationType => {
    const {  title, component, onDelete  } = props
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(false)

    const close = useCallback(
        () => {
            setOpen(false)
        },
        [],
    )
    const open = useCallback(
        () => {
            setOpen(true)
        },
        [],
    )

    const onDeleteClicked = useCallback(async () => {
        await onDelete()
        close()
    }, [onDelete, close])

    const actions = useMemo((): Action[] => [{
        key: "cancel",
        label: t("cancel"),
        onClick: close,
        variant: "text"
    }, {
        key: "delete",
        label: t("delete"),
        color: "error",
        onClick: onDeleteClicked,
    }], [close, t, onDeleteClicked])


    const popup = useMemo(() => (
        <PopUp open={isOpen} onClose={close} actions={actions}>
            <Typography sx={{ whiteSpace: "pre-line" }} color="secondary" variant="h4">{title}</Typography>
            {component && <>{component}</>}
        </PopUp>
    ), [isOpen, close, t, actions, component, title]);

    return {
        popup,
        isOpen,
        setOpen,
        close: close,
        open: open
    }
}