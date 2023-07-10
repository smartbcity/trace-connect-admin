import {useAuth, KeycloackService, AuthedUser} from "@smartb/g2"
import {Roles, userAdminRoles, userEffectiveRoles} from "./roles";
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
    isAdmin: {
        returnType: boolean;
    }
}

const staticServices: KeycloackService<StaticServices, Roles> = {
    hasUserRouteAuth: (_, services, params) => {
        const { route = "", authorizedUserId, authorizedUserOrgId } = params ?? {}
        const currentUser = services.getUser()
        const isAuthedUserId = !!authorizedUserId && currentUser?.id === authorizedUserId
        const isAuthedOrgId = !!authorizedUserOrgId && currentUser?.memberOf === authorizedUserOrgId
        const authorizations = routesAuthorizations[route]
        if (authorizations === "open") return true
        else return checkRelations(authorizations, currentUser, isAuthedUserId, isAuthedOrgId, services.hasRole)
    },
    isAdmin: (_, services): boolean => {
        const currentUser = services.getUser()
        const roles =  currentUser?.roles ?? []
        return (
            userAdminRoles.some(role => roles.includes(role))
        )
    }
}

export const useExtendedAuth = () => useAuth<StaticServices, Roles>(userEffectiveRoles, staticServices)

const matches = (authorization: RoutesRoles, currentUser: AuthedUser | undefined, isAuthedUserId: boolean, isAuthedOrgId: boolean, hasRole: (roles: Roles[]) => boolean) => {
    if (authorization === "currentUser") {
        return isAuthedUserId
    }
    if (authorization === "memberOf") {
        return isAuthedOrgId
    }
    if (authorization === "hasOrganization") {
        return !!currentUser?.memberOf
    }
    if (authorization === "isAdmin") {
        console.log("isAdmin", currentUser?.roles)
        console.log("isAdmin", userAdminRoles)
        console.log("isAdmin", userAdminRoles.some(role => currentUser?.roles?.includes(role)))
        return userAdminRoles.some(role => currentUser?.roles?.includes(role))
    }
    return hasRole([authorization])
}

const checkRelations = (authorizations: RoutesRoles[] | RoutesRoles[][], currentUser: AuthedUser | undefined, isAuthedUserId: boolean, isAuthedOrgId: boolean, hasRole: (roles: Roles[]) => boolean) => {
    return authorizations.some((roles: any) => {
        if (Array.isArray(roles)) {
            console.log("roles.isArray", roles)
            return roles.every(role => matches(role, currentUser, isAuthedUserId, isAuthedOrgId, hasRole))
        } else {
            return matches(roles, currentUser, isAuthedUserId, isAuthedOrgId, hasRole)
        }
    })
}
