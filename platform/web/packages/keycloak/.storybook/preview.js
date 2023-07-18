import { CssBaseline } from "@mui/material";
import { ThemeContextProvider } from "@smartb/g2-themes";
import "./default.css";

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    options: {
        storySort: (a, b) =>
            a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, {numeric: true}),
    },
}

export const withThemeProvider = (Story) => {
    return (
      <ThemeContextProvider>
        <CssBaseline />
        <Story />
      </ThemeContextProvider>
    );
  };
  
  export const decorators = [withThemeProvider];