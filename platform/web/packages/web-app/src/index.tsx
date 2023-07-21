import React from "react";
import {
  AppProvider,
  KeycloakProvider
} from "@smartb/g2-providers";
import { ThemeContextProvider } from "@smartb/g2-themes";
import { Typography } from "@mui/material";
import { languages } from "components";
import { theme } from "Themes";
import { QueryClient } from 'react-query'
import { createRoot } from 'react-dom/client'
import { AppRouter } from "App/routes";

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

root.render(
  <React.StrictMode //react strict mode must be here to avoid an infinite loop if placed above KeycloakProvider
  >
    {/* @ts-ignore */}
    <ThemeContextProvider theme={theme}>
      <KeycloakProvider >
          <AppProvider
            languages={languages}
            queryClient={queryClient}
            loadingComponent={<Typography>Loading...</Typography>}
          >
            <AppRouter />
          </AppProvider>
      </KeycloakProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);

