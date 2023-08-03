import { createRoot } from "react-dom/client";
import { StrictMode, lazy, Suspense } from "react";
import { kcContext as kcLoginThemeContext } from "./keycloak-theme/login/kcContext";
import { kcContext as kcAccountThemeContext } from "./keycloak-theme/account/kcContext";
import { ThemeContextProvider } from "@smartb/g2";
import { theme } from "./Themes";

const KcLoginThemeApp = lazy(() => import("./keycloak-theme/login/KcApp"));
const KcAccountThemeApp = lazy(() => import("./keycloak-theme/account/KcApp"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* @ts-ignore */}
        <ThemeContextProvider theme={theme}>
            <Suspense>
                {(() => {

                    if (kcLoginThemeContext !== undefined) {
                        return <KcLoginThemeApp kcContext={kcLoginThemeContext} />;
                    }

                    if (kcAccountThemeContext !== undefined) {
                        return <KcAccountThemeApp kcContext={kcAccountThemeContext} />;
                    }

                    throw new Error(
                        "This app is a Keycloak theme" +
                        "It isn't meant to be deployed outside of Keycloak"
                    );

                })()}
            </Suspense>
        </ThemeContextProvider>
    </StrictMode>
);
