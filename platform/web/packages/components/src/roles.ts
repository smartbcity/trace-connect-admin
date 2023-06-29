import { Option } from "@smartb/g2"
import { TFunction } from "i18next"

export const userAdminRoles = [
    "tr_orchestrator_admin",
    "tr_project_manager_admin",
    "tr_stakeholder_admin"
] as const

export const userRoles = [
    "super_admin",
    ...userAdminRoles,
    "tr_orchestrator_user",
    "tr_project_manager_user",
    "tr_stakeholder_user",
] as const



export type UserRoles = typeof userRoles[number]

export const mutableUserRoles: UserRoles[] = [...userRoles]

export const userRolesColors: { [roles in UserRoles]: string } = {
    "super_admin": "#d1b00a",
    "tr_orchestrator_admin": "#E56643",
    'tr_orchestrator_user': "#3041DC",
    "tr_project_manager_admin": "#E56643",
    "tr_project_manager_user": "#3041DC",
    "tr_stakeholder_admin": "#E56643",
    "tr_stakeholder_user": "#3041DC",
}

export const getUserRolesOptions = (t: TFunction, orgRole?: OrgRoles, withSuperAdmin: boolean = false) => {

    const roles: Option[] = []
    if (withSuperAdmin) {
        roles.push({
            key: "super_admin",
            label: t(`roles.super_admin`) as string,
            color: userRolesColors["super_admin"]
        })
    }
    const admin = orgRole ? orgRole + "_admin" as UserRoles : "admin" as UserRoles
    roles.push({
        key: admin,
        label: t(`roles.admin`) as string,
        color: userRolesColors[admin]
    })
    const user =  orgRole ? orgRole + "_user" as UserRoles: "user" as UserRoles
    roles.push({
        key: user,
        label: t(`roles.user`) as string,
        color: userRolesColors[user]
    })
    return roles
}

export const orgRoles = [
    "tr_orchestrator",
    "tr_project_manager",
    "tr_stakeholder"
] as const

export type OrgRoles = typeof orgRoles[number]

const mutableOrgRoles: OrgRoles[] = [...orgRoles]

export const orgRolesColors: { [roles in OrgRoles]: string } = {
    "tr_orchestrator": "#27848f",
    "tr_project_manager": "#27848f",
    "tr_stakeholder": "#27848f"
}

export const getOrgRolesOptions = (t: TFunction) => {
    return mutableOrgRoles.map(role => ({
        key: role,
        label: t("organizationRoles." + role),
        color: orgRolesColors[role]
    })
    )
}

export const userEffectiveRoles = [...userRoles, ...orgRoles]

export type Roles = typeof userEffectiveRoles[number]