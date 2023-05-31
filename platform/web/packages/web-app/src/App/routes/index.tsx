import { NoMatchPage, Router } from "@smartb/g2";
import { Route, useParams, useSearchParams } from "react-router-dom";
import { Routes, useExtendedAuth } from "components";
import { App } from "App";
import {OrganizationListPage, OrganizationProfilePage, UserListPage, UserProfilePage, } from "im"
import {useMemo} from "react"


const imPages: PageRoute[] = [{
  path: "organizations",
  element: <OrganizationListPage />
}, {
  path: "organizations/add",
  element: <OrganizationProfilePage readOnly={false} />
}, {
  path: "organizations/:organizationId/view",
  element: <OrganizationProfilePage readOnly />
}, {
  path: "organizations/:organizationId/edit",
  element: <OrganizationProfilePage readOnly={false} />
}, {
  path: "myOrganization",
  element: <OrganizationProfilePage myOrganization readOnly />
}, {
  path: "myOrganization/edit",
  element: <OrganizationProfilePage myOrganization readOnly={false} />
}, {
  path: "users",
  element: <UserListPage />
}, {
  path: "users/add",
  element: <UserProfilePage readOnly={false} />
}, {
  path: "users/:userId/view",
  element: <UserProfilePage readOnly />
}, {
  path: "users/:userId/edit",
  element: <UserProfilePage readOnly={false} />
}, {
  path: "myProfil",
  element: <UserProfilePage myProfil readOnly />
}, {
  path: "myProfil/edit",
  element: <UserProfilePage myProfil readOnly={false} />
}]

const allPages: PageRoute[] = [...imPages]

export const AppRouter = () => {
  const { service } = useExtendedAuth()
  const pages = useMemo(() => allPages.map((page) => GenerateRoute(page)), [])
  return (
    <Router>
      <Route path="/" element={<App />} >
        <Route path="" element={service.is_super_admin() ? <OrganizationListPage /> : <OrganizationProfilePage myOrganization readOnly />} />
        {pages}
      </Route >
    </Router>
  );
};

export interface PageRoute {
  path: Routes
  element: JSX.Element
}

export const GenerateRoute = (props: PageRoute) => {
  const { element, path } = props
  return (
    <Route key={path} path={path} element={
      <PrivateElement route={path}>
        {element}
      </PrivateElement>
    } />
  )
}

export const PrivateElement = (props: { route: Routes, children: JSX.Element }) => {
  const { service } = useExtendedAuth()
  const { userId, organizationId } = useParams()
  const [searchParams] = useSearchParams()
  if (!service.hasUserRouteAuth({ route: props.route, authorizedUserId: searchParams.get("userId") ?? userId, authorizedUserOrgId: searchParams.get("organizationId") ?? organizationId })) return <NoMatchPage />
  return props.children;
}