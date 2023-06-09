import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import {Action, PopUp, TextField} from "@smartb/g2";
import {IconButton, Stack, Typography} from "@mui/material";
import {OrganizationAddedApiKeyEvent} from "../api";
import {VisibilityOffRounded, VisibilityRounded} from "@mui/icons-material";

export interface useCreatedConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    open: (event : OrganizationAddedApiKeyEvent) => void
    close: () => void
}

export const useCreatedConfirmationPopUp = (): useCreatedConfirmationType => {
    const { t } = useTranslation()
    const [keyCreatedEvent, setKeyCreatedEvent] = useState<OrganizationAddedApiKeyEvent | null>(null)

    const close = useCallback(
        () => {
            setKeyCreatedEvent(null)
        },
        [],
    )
    const open = useCallback(
        (event : OrganizationAddedApiKeyEvent) => {
            setKeyCreatedEvent(event)
        },
        [],
    )

    const actions = useMemo((): Action[] => [{
        key: "close",
        label: t("close"),
        color: "primary",
        onClick: close,
    }], [close, t])

    const isOpen = keyCreatedEvent !== null
    const [isHidden, setHidden] = useState(true)

    const popup = useMemo(() => (
        <PopUp open={isOpen} onClose={close} actions={actions}>
            <Typography sx={{ whiteSpace: "pre-line" }} color="secondary" variant="h4">{t("apiKeysList.created")}</Typography>
            <Stack gap={(theme) => `${theme.spacing(4)}`} sx={{margin : (theme) => `${theme.spacing(4)} 0`}}>
                <Typography>{t("apiKeysList.createdMessage")}</Typography>
                <TextField value={keyCreatedEvent?.keySecret} textFieldType={isHidden ? "password" : "text"} iconPosition='end' inputIcon={<IconButton onClick={() => {setHidden(!isHidden)}}>{isHidden ? <VisibilityRounded /> :  <VisibilityOffRounded />}</IconButton>} />
            </Stack>
        </PopUp>
    ), [keyCreatedEvent, close, t, actions, isHidden]);

    return {
        popup: popup,
        isOpen : isOpen,
        close: close,
        open: open
    }
}