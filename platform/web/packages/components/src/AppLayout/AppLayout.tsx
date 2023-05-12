import React from 'react'
import { MenuItem, StandAloneAppLayout, UserMenuProps } from '@smartb/g2'
import { Link, LinkProps } from "react-router-dom";

interface AppProps {
    children?: React.ReactNode
    menu: MenuItem[],
    logo: string
    userMenuProps?: UserMenuProps
}

export const AppLayout = (props: AppProps) => {
    const { children, menu, logo, userMenuProps } = props

    return (
        <StandAloneAppLayout
            logo={{
                src: logo,
                item: { component: Link, componentProps: { to: "/" } } as Omit<MenuItem<LinkProps>, "key">
            }}
            menu={menu}
            userMenuProps={userMenuProps}
        >
            {children}
        </StandAloneAppLayout>
    )
}
