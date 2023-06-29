import { useCallback, useMemo } from "react"
import {Roles, userAdminRoles} from "./roles"
import { insertObjectIdsInsideRoutes, RecordCamelCase } from "@smartb/g2"
import {useExtendedAuth} from "./auth"

const IMRoutesAuthorizations = {
    "organizations": "open",
    "organizations/add": "open",
    "organizations/:organizationId/view": "open",
    "organizations/:organizationId/edit": "tr_orchestrator_admin",
    "myOrganization": "open",
    "myOrganization/edit": userAdminRoles,
    "users": "open",
    "users/add": userAdminRoles,
    "users/:userId/view": "open",
    "users/:userId/edit": [["memberOf", userAdminRoles]],
    "myProfil": "open",
    "myProfil/edit": "open",
    "apiKeys": userAdminRoles,
    "apiKeys/add": userAdminRoles,
} as const

const strictRoutesAuthorizations = {
    "": "open",
    ...IMRoutesAuthorizations,
} as const

export type Routes = keyof typeof strictRoutesAuthorizations

export type RoutesRoles = Roles | "memberOf" | "currentUser"
export type RoutesAuthorizations = { [route: string]: RoutesRoles[] | RoutesRoles[][] | "open" }
//@ts-ignore
export const routesAuthorizations: RoutesAuthorizations = { ...strictRoutesAuthorizations }


type RoutesDefinitions = RecordCamelCase<Routes, (...objectIds: string[]) => string>

//@ts-ignore
let routesDefinitions: RoutesDefinitions = {}

for (let route in strictRoutesAuthorizations) {
    const camelCasedRoute = route
    .replaceAll("?", "")
    .replaceAll("*", "All")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    //@ts-ignore
    routesDefinitions[camelCasedRoute] = (...objectIds: string[]) => "/" + insertObjectIdsInsideRoutes(route, ...objectIds)
}


export const useRoutesDefinition = (): RoutesDefinitions => {
    const { service } = useExtendedAuth()

    const user = useMemo(() => service.getUser(), [service.getUser])

    const getOrganizationsView = useCallback(
        (organizationId?: string) => {
            return organizationId === user?.memberOf ? "/myOrganization" : `/organizations/${organizationId}/view`
        },
        [user?.memberOf],
    )

    const getOrganizationsEdit = useCallback(
        (organizationId?: string) => {
            return organizationId === user?.memberOf ? "/myOrganization/edit" : `/organizations/${organizationId}/edit`
        },
        [user?.memberOf],
    )

    const getUsersView = useCallback(
        (userId?: string) => {
            return userId === user?.id ? "/myProfil" : `/users/${userId}/view`
        },
        [user?.id],
    )

    const getUsersAdd = useCallback(
        (organizationId?: string) => {
            return organizationId ? `/users/add?organizationId=${organizationId}` : "/users/add"
        },
        [],
    )

    const getUsersEdit = useCallback(
        (userId?: string) => {
            return userId === user?.id ? "/myProfil/edit" : `/users/${userId}/edit`
        },
        [user?.id],
    )

    return useMemo(() => ({
        ...routesDefinitions,
        organizationsOrganizationIdView: getOrganizationsView,
        organizationsOrganizationIdEdit: getOrganizationsEdit,
        usersUserIdView: getUsersView,
        usersAdd: getUsersAdd,
        usersUserIdEdit: getUsersEdit
    }), [user])
}
