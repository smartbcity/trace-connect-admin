import { Option, QueryParams, i2Config, useQueryRequest } from "@smartb/g2"
import { city } from "@smartb/privilege-domain"
import { useMemo } from "react"
import { useOidcAccessToken } from '@axa-fr/react-oidc'
import { TFunction } from "i18next"


export interface Role extends city.smartb.im.f2.privilege.domain.role.model.RoleDTO { }

export interface Permission extends city.smartb.im.f2.privilege.domain.permission.model.PermissionDTO { }

export const RoleTargetValues = city.smartb.im.f2.privilege.domain.role.model.RoleTargetValues

export interface RoleListQuery extends city.smartb.im.f2.privilege.domain.role.query.RoleListQueryDTO { }

export interface RoleListResult extends city.smartb.im.f2.privilege.domain.role.query.RoleListResultDTO { }

export const useRoleListQuery = (params: QueryParams<RoleListQuery, RoleListResult>) => {
    const { accessToken } = useOidcAccessToken()
    const requestProps = useMemo(() => ({
        url: i2Config().orgUrl,
        jwt: accessToken
    }), [accessToken])
    return useQueryRequest<RoleListQuery, RoleListResult>(
        "roleList", requestProps, params
    )
}

export interface PermissionListQuery extends city.smartb.im.f2.privilege.domain.permission.query.PermissionListQueryDTO { }

export interface PermissionListResult extends city.smartb.im.f2.privilege.domain.permission.query.PermissionListResultDTO { }

export const usePermissionListQuery = (params: QueryParams<PermissionListQuery, PermissionListResult>) => {
    const { accessToken } = useOidcAccessToken()
    const requestProps = useMemo(() => ({
        url: i2Config().orgUrl,
        jwt: accessToken
    }), [accessToken])
    return useQueryRequest<PermissionListQuery, PermissionListResult>(
        "permissionList", requestProps, params
    )
}

export const getUserRolesOptions = (lang: string, t: TFunction, orgRole?: Role, roles?: Role[], withSuperAdmin: boolean = false) => {
    if (!roles || !orgRole) return []

    const options: Option[] = []

    const targetedUserRoles: string[] = orgRole.bindings.user

    roles.forEach((role) => {
        if (targetedUserRoles.includes(role.identifier)) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: role.identifier.includes("user") ? "#3041DC" : "#E56643"
            })
        }
    })

    if (withSuperAdmin) {
        options.push({
            key: "super_admin",
            label: t(`roles.super_admin`) as string,
            color: "#d1b00a"
        })
    }

    return options
}

export const getOrgRolesOptions = (lang: string, roles?: Role[]) => {
    if (!roles) return []
    const options: Option[] = []
    roles.forEach(role => {
        if (role.targets.includes(RoleTargetValues.organization())) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: "#27848f"
            })
        }
    }
    )
}

export const permissions = [
    "im_read_user",
    "im_write_user",
    "im_read_organization",
    "im_write_organization",
    "im_read_role",
    "im_write_role",
    "im_write_my_organization",
    "im_read_apikey",
    "im_write_apikey",
    "super_admin"
] as const

export type Permissions = typeof permissions[number]

export const mutablePermissions: Permissions[] = [...permissions]




/* export const userAdminRoles = [
    "tr_orchestrator_admin",
    "tr_project_manager_admin",
    "tr_stakeholder_admin"
] as const

export const userBaseRoles = [
    "tr_orchestrator_user",
    "tr_project_manager_user",
    "tr_stakeholder_user",
] as const

export const userRoles = [
    "super_admin",
    ...userAdminRoles,
    ...userBaseRoles
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

export type Roles = typeof userEffectiveRoles[number] */