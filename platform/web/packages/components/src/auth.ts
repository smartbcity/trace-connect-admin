import {useAuth, KeycloackService, AuthedUser} from "@smartb/g2"
import {Permissions, mutablePermissions, usePermissionListQuery, useRoleListQuery} from "./roles";
import { Routes, routesAuthorizations, RoutesRoles } from "./routes";

type StaticServices = {
    hasUserRouteAuth: {
        returnType: boolean;
        paramsType: {
            route: Routes,
            authorizedUserId?: string
            authorizedUserOrgId?: string
        }
    }
}

const staticServices: KeycloackService<StaticServices, Permissions> = {
    hasUserRouteAuth: (_, services, params) => {
        const { route = "", authorizedUserId, authorizedUserOrgId } = params ?? {}
        const currentUser = services.getUser()
        const isAuthedUserId = !!authorizedUserId && currentUser?.id === authorizedUserId
        const isAuthedOrgId = !!authorizedUserOrgId && currentUser?.memberOf === authorizedUserOrgId
        const authorizations = routesAuthorizations[route]
        if (authorizations === "open") return true
        else return checkRelations(authorizations, currentUser, isAuthedUserId, isAuthedOrgId, services.hasRole)
    }
}

export const useExtendedAuth = () =>  {
    const auth = useAuth<StaticServices, Permissions>(mutablePermissions, staticServices)
    const permissionsQuery = usePermissionListQuery({query:{}})
    const rolesQuery = useRoleListQuery({query:{}})
    return {
        ...auth,
        roles: rolesQuery.data?.items,
        permissions: permissionsQuery.data?.items
    }
}

const matches = (authorization: RoutesRoles, currentUser: AuthedUser | undefined, isAuthedUserId: boolean, isAuthedOrgId: boolean, hasRole: (roles: Permissions[]) => boolean) => {
    if (authorization === "currentUser") {
        return isAuthedUserId
    }
    if (authorization === "memberOf") {
        return isAuthedOrgId
    }
    if (authorization === "hasOrganization") {
        return !!currentUser?.memberOf
    }
    return hasRole([authorization])
}

const checkRelations = (authorizations: RoutesRoles[] | RoutesRoles[][], currentUser: AuthedUser | undefined, isAuthedUserId: boolean, isAuthedOrgId: boolean, hasRole: (roles: Permissions[]) => boolean) => {
    return authorizations.some((roles: any) => {
        if (Array.isArray(roles)) {
            return roles.every(role => matches(role, currentUser, isAuthedUserId, isAuthedOrgId, hasRole))
        } else {
            return matches(roles, currentUser, isAuthedUserId, isAuthedOrgId, hasRole)
        }
    })
}
