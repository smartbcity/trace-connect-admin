import { useExtendedAuth } from "components";
import { useMenu, useUserMenu } from "./menu";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { StandAloneAppLayout } from "@smartb/g2";

export const App = () => {
  const { t } = useTranslation()
  const menu = useMenu(t)
  const { service, keycloak } = useExtendedAuth()
  const user = useMemo(() => service.getUser(), [service.getUser])
  const { loggedMenu, notLoggedMenu } = useUserMenu(keycloak.logout, keycloak.login, t)

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

