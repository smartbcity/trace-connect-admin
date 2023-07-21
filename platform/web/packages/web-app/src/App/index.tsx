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
  console.log(keycloak.token, keycloak.tokenParsed)
  const { loggedMenu, notLoggedMenu } = useUserMenu(keycloak.logout, keycloak.login, t)

  return (
    <StandAloneAppLayout
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

