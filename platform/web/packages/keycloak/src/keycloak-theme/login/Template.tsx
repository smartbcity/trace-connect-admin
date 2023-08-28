// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { type TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import { CssBaseline, Stack, styled, useMediaQuery, useTheme } from '@mui/material'
import { Alert } from "@smartb/g2"
import bg from "./assets/traceLoginBackground.png"
import { TraceIcon } from "components"

const Main = styled('main')(({ theme }) => ({
    flexGrow: 1,
    width: "100vw",
    height: '100vh',
    overflow: 'auto',
    display: "flex",
    background: theme.palette.background.default
}))

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayMessage = true,
        kcContext,
        children,
    } = props;

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const { message, isAppInitiatedAction } = kcContext;

    return (
        <Main>
            <CssBaseline />
            {!isMobile && <img
                src={bg}
                alt="login background"
                style={{
                    height: "100%"
                }}
            />}
            <Stack
                flexGrow={1}
                flexBasis={0}
                alignItems="center"
                justifyContent="center"
                padding={5}
            >
                <Stack
                    spacing={4}
                    maxWidth="450px"
                    width="100%"
                >
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Alert
                            sx={{
                                maxWidth: "unset !important",
                                width: "100% !important",
                                zIndex: 1,
                                "& .MuiSnackbarContent-root": {
                                    boxShadow: (theme) => theme.shadows[1],
                                }
                            }}
                            severity={message.type}
                            isRelative
                            colorBase='light'
                        >
                            {message.summary}
                        </Alert>
                    )}
                    <TraceIcon style={{ height: "50px" }} />
                    {children}
                </Stack>
            </Stack>
        </Main >
    );
}
