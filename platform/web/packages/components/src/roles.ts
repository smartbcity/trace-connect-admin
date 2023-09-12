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

export const getUserRoleColor = (role?: string) => role === "super_admin" ? "#d1b00a" : role === "user" ? "#3041DC" : "#E56643"

export const getUserRolesFilterOptions = (t: TFunction) => {

    const roles: Option[] = []
    roles.push({
        key: "admin",
        label: t(`roles.admin`) as string,
        color: getUserRoleColor("admin")
    })
    roles.push({
        key: "user",
        label: t(`roles.user`) as string,
        color: getUserRoleColor("user")
    })
    return roles
}

export const getUserRolesOptions = (lang: string, orgRole?: Role, roles?: Role[]) => {
    if (!roles || !orgRole) return []

    const options: Option[] = []
    const targetedUserRoles: Role[] = orgRole.bindings["USER"]
    if (Object.keys(targetedUserRoles).length === 0) return []
    roles.forEach((role) => {
        if (targetedUserRoles.find((target) => target.identifier === role.identifier)) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: getUserRoleColor(role.identifier)
            })
        }
    })

    return options
}

export const getOrgRoleColor = () => "#27848f"

export const getOrgRolesOptions = (lang: string, roles?: Role[]) => {
    if (!roles) return []
    const options: Option[] = []
    roles.forEach(role => {
        if (role.targets.includes(RoleTargetValues.organization())) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: getOrgRoleColor()
            })
        }
    }
    )
    return options
}

export const getApiKeysRolesOptions = (lang: string, orgRole?: Role, roles?: Role[]) => {
    if (!roles || !orgRole) return []
    const targetedRoles: Role[] = orgRole.bindings["API_KEY"]
    if (Object.keys(targetedRoles).length === 0) return []
    const options: Option[] = []
    roles.forEach(role => {
        if (targetedRoles.find((target) => target.identifier === role.identifier)) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: getUserRoleColor(role.identifier)
            })
        }
    }
    )
    return options
}

export const permissions = [
    "im_user_read",
    "im_user_write",
    "im_organization_read",
    "im_organization_write_own",
    "im_organization_write",
    "im_role_read",
    "im_role_write",
    "im_apikey_read",
    "im_apikey_write"
] as const

export type Permissions = typeof permissions[number]

export const mutablePermissions: Permissions[] = [...permissions]
