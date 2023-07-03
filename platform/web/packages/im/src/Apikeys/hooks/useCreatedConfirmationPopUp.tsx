import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import {Action, PopUp, TextField} from "@smartb/g2";
import {IconButton, Stack, Typography} from "@mui/material";
import {VisibilityOffRounded, VisibilityRounded} from "@mui/icons-material";
import {useRoutesDefinition} from "components";
import {useNavigate} from "react-router-dom";
import {ApiKeyAddedEvent} from "../api/command/add";

export interface useCreatedConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    open: (event : ApiKeyAddedEvent) => void
    close: () => void
}

export const useCreatedConfirmationPopUp = (): useCreatedConfirmationType => {
    const { t } = useTranslation()
    const [keyCreatedEvent, setKeyCreatedEvent] = useState<ApiKeyAddedEvent | null>(null)
    const { apiKeys } = useRoutesDefinition()
    const navigate = useNavigate()

    const close = useCallback(
        () => {
            setKeyCreatedEvent(null)
            navigate(apiKeys())
        },
        [],
    )
    const open = useCallback(
        (event : ApiKeyAddedEvent) => {
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