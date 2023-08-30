import { useCallback, useMemo } from "react"
import { insertObjectIdsInsideRoutes, RecordCamelCase } from "@smartb/g2"
import {useExtendedAuth} from "./auth"
import { Permissions } from "./roles"

const IMRoutesAuthorizations = {
    "organizations": ["im_read_organization"],
    "organizations/add": ["im_write_organization"],
    "organizations/:organizationId/view": ["im_read_organization"],
    "organizations/:organizationId/edit": ["im_write_organization"],
    "myOrganization": "open",
    "myOrganization/edit": ["im_write_my_organization"],
    "users": "open",
    "users/add": [["memberOf", "im_write_user"], ["im_write_user", "im_write_organization"]],
    "users/:userId/view": "open",
    "users/:userId/edit": ["im_write_user"],
    "myProfil": "open",
    "myProfil/edit": "open",
    "apiKeys": ["im_read_apikey"],
    "apiKeys/add": ["im_write_apikey"],
    "fileList": ["im_write_organization"]
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
