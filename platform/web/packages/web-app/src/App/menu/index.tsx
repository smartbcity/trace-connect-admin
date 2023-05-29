import { Link, LinkProps } from "react-router-dom";
import { useMemo } from "react";
import { MenuItems } from '@smartb/g2-components'
import { useLocation } from "react-router";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import BusinessIcon from '@mui/icons-material/Business';
import { AccountCircle, Login, Logout } from "@mui/icons-material";
import { TFunction } from "i18next";
import { useExtendedAuth, useRoutesDefinition } from "components";

interface MenuItem {
    key: string,
    to?: string,
    action?: () => void,
    label: string
    icon: JSX.Element;
    isVisible?: boolean;
}

export const getMenu = (location: string, menu: MenuItem[]): MenuItems<LinkProps>[] => {
    const finalMenu: MenuItems<LinkProps>[] = []
    menu.forEach((item): MenuItems<LinkProps> | undefined => {
        const additionals = item.to ? {
            component: Link,
            componentProps: {
                to: item.to
            }
        } : {
            goto: item.action
        }
        if (item.isVisible === false) return
        finalMenu.push({
            key: `appLayout-${item.key}`,
            label: item.label,
            icon: item.icon,
            isSelected: item.to ? item.to === "/" ? item.to === location : location.includes(item.to) : false,
            ...additionals
        })
    })
    return finalMenu
}

export const useMenu = (t: TFunction) => {
    const location = useLocation()
    const {service} = useExtendedAuth()
    const {organizations, users} = useRoutesDefinition()
    const menu: MenuItem[] = useMemo(() => [{
        key: "organizations",
        to: organizations(),
        label: t("organizations"),
        icon: <BusinessIcon />,
        isVisible: service.hasUserRouteAuth({route: "organizations"})
    }, {
        key: "users",
        to: users(),
        label: t("manageUsers"),
        icon: <SupervisedUserCircleIcon />,
        isVisible: service.hasUserRouteAuth({route: "users"})
    }], [t, service.hasUserRouteAuth])
    return useMemo(() => getMenu(location.pathname, menu), [location.pathname, menu])
}

export const useUserMenu = (logout: () => void, login: () => void, t: TFunction) => {
    const location = useLocation()
    const {service} = useExtendedAuth()
    const {myProfil, myOrganization} = useRoutesDefinition()
    const loggedMenu: MenuItem[] = useMemo(() => [{
        key: "profil",
        to: myProfil(),
        label: t("profil"),
        icon: <AccountCircle />,
        isVisible: service.hasUserRouteAuth({route: "myProfil"})
    },{
        key: "myOrganization",
        to: myOrganization(),
        label: t("myOrganization"),
        icon: <AccountCircle />,
        isVisible: service.hasUserRouteAuth({route: "myOrganization"})
    }, {
        key: "logout",
        action: logout,
        label: t("logout"),
        icon: <Logout />
    }], [logout, t])

    const notLoggedMenu: MenuItem[] = useMemo(() => [{
        key: "login",
        action: login,
        label: t("login"),
        icon: <Login />
    }], [Login, t, service.hasUserRouteAuth])

    return {
        loggedMenu: useMemo(() => getMenu(location.pathname, loggedMenu), [location.pathname, loggedMenu]),
        notLoggedMenu: useMemo(() => getMenu(location.pathname, notLoggedMenu), [location.pathname, notLoggedMenu])
    }
}

