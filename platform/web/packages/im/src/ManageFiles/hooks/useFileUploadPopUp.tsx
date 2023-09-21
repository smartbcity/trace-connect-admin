import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import { Action, PopUp } from "@smartb/g2";
import { Typography } from "@mui/material";

export interface UseFileUploadPopUpProps {
    title: string
    component?: React.ReactNode
    onUpload: () => Promise<void>
}

export interface UseFileUploadPopUpType {
    popup: React.ReactNode
    isOpen: boolean
    setOpen: (open: boolean) => void
    open: () => void
    close: () => void
}

export const useFileUploadPopUp = (props: UseFileUploadPopUpProps): UseFileUploadPopUpType => {
    const {  title, component, onUpload  } = props
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(false)

    const close = useCallback(
        async() => {
            await onUpload()
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

    const actions = useMemo((): Action[] => [{
        key: "cancel",
        label: t("cancel"),
        onClick: close,
        variant: "text"
    }], [close, t])


    const popup = useMemo(() => (
        <PopUp open={isOpen} fullWidth onClose={close} actions={actions}>
            <Typography sx={{ whiteSpace: "pre-line", mb: "2rem" }} color="secondary" variant="h5">{title}</Typography>
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