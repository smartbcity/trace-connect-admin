// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { type TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import { CssBaseline, Stack, Typography, styled} from '@mui/material'
import { Alert, Section } from "@smartb/g2"
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
        headerNode
    } = props;

    const { message, isAppInitiatedAction } = kcContext;

    return (
        <Main>
            <CssBaseline />
            <Stack
                flexGrow={1}
                flexBasis={0}
                alignItems="center"
                justifyContent="center"
                padding={5}
                gap={5}
            >
                {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                    <Alert
                        sx={{
                            maxWidth: "600px !important",
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
                <Section
                    sx={{
                        maxWidth: "600px",
                        width: "100%"
                    }}
                    flexContent

                >
                    <TraceIcon style={{ height: "60px", alignSelf: "center" }} />
                    {headerNode && <Typography sx={{color: "primary.main", alignSelf: "center" }} variant="h6">{headerNode}</Typography>}
                    {children}
                </Section>
            </Stack>
        </Main >
    );
}
