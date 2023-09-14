import { useExtendedAuth } from "components";
import { useMenu, useUserMenu } from "./menu";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { StandAloneAppLayout } from "@smartb/g2";

export const App = () => {
  const { t, i18n } = useTranslation()
  const menu = useMenu(t)
  const { service, keycloak } = useExtendedAuth()
  const user = useMemo(() => service.getUser(), [service.getUser])
  const { loggedMenu, notLoggedMenu } = useUserMenu(keycloak.logout, keycloak.login, t)

  useEffect(() => {
    i18n.language.includes("fr") ? i18n.changeLanguage("fr") : i18n.changeLanguage("en")
  }, [i18n.language])
  

  return (
    <StandAloneAppLayout
    drawerProps={{
      sx: {
        "& .MuiListItemButton-root.Mui-selected": {
          background: "none",
          color: "primary.main"
        },
        "& .MuiListItemButton-root.Mui-selected .MuiListItemIcon-root": {
          color: "primary.main"
        },
        "& .MuiListItemButton-root": {
          color: "secondary.main"
        },
        "& .MuiListItemButton-root .MuiListItemIcon-root": {
          color: "secondary.main"
        }
      }
    }}
      menu={menu}
      userMenuProps={{
        currentUser: user ? {
          givenName: user.firstName ?? "",
          familyName: user.lastName ?? "",
          role: "Admin"
        } : undefined,
        loggedMenu,
        notLoggedMenu
      }}
    >
      <Outlet />
    </StandAloneAppLayout>
  );
};

