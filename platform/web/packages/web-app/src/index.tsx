import React from "react";
import {
  AppProvider,
  KeycloakProvider,
  g2Config,
  OidcSecure
} from "@smartb/g2-providers";
import { ThemeContextProvider } from "@smartb/g2-themes";
import { Typography } from "@mui/material";
import { languages } from "components";
import { theme } from "Themes";
import { QueryClient } from 'react-query'
import { createRoot } from 'react-dom/client'
import { AppRouter } from "App/routes";
import { OidcConfiguration } from "@axa-fr/oidc-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 86400000 //stale time set to one day
    }
  }
})

//@ts-ignore
const container: HTMLElement = document.getElementById("root")

const root = createRoot(container)

const oidcConfiguration: OidcConfiguration = {
  client_id: g2Config().keycloak.clientId,
  redirect_uri: window.location.origin + '/authentication/callback',
  silent_redirect_uri:
    window.location.origin + '/authentication/silent-callback',
  scope: 'openid',
  authority: g2Config().keycloak.url + '/realms/' + g2Config().keycloak.realm,
  service_worker_relative_url:'/OidcServiceWorker.js',
  storage: localStorage,
  service_worker_only:false,
}

root.render(
  <React.StrictMode //react strict mode must be here to avoid an infinite loop if placed above KeycloakProvider
  >
    {/* @ts-ignore */}
    <ThemeContextProvider theme={theme}>
      <KeycloakProvider 
      configuration={oidcConfiguration}
      >
        <OidcSecure>
          <AppProvider
            languages={languages}
            queryClient={queryClient}
            loadingComponent={<Typography>Loading...</Typography>}
          >
            <AppRouter />
          </AppProvider>
          </OidcSecure>
      </KeycloakProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);

