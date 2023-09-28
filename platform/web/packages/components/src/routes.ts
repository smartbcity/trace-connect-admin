import { useCallback, useMemo } from "react"
import { insertObjectIdsInsideRoutes, RecordCamelCase } from "@smartb/g2"
import {useExtendedAuth} from "./auth"
import { Permissions } from "./roles"

const IMRoutesAuthorizations = {
    "organizations": ["im_organization_read"],
    "organizations/add": ["im_organization_write"],
    "organizations/:organizationId/view": ["im_organization_read"],
    "organizations/:organizationId/edit": ["im_organization_write"],
    "myOrganization": "open",
    "myOrganization/edit": ["im_organization_write_own"],
    "users": "open",
    "users/add": ["im_user_write"],
    "users/:userId/view": "open",
    "users/:userId/edit": ["im_user_write"],
    "myProfil": "open",
    "myProfil/edit": "open",
    "apiKeys": ["im_apikey_read"],
    "apiKeys/add": ["im_apikey_write"],
    "files": ["tr_orchestrator"],
    "files/*": ["tr_orchestrator"],
} as const

const strictRoutesAuthorizations = {
    "": "open",
    ...IMRoutesAuthorizations,
} as const

export type Routes = keyof typeof strictRoutesAuthorizations

export type RoutesRoles = Permissions | "hasOrganization" | "memberOf" | "currentUser"
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
