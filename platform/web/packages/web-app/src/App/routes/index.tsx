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
  element: <OrganizationProfilePage readonly={false} />
}, {
  path: "organizations/:organizationId/view",
  element: <OrganizationProfilePage readonly />
}, {
  path: "organizations/:organizationId/edit",
  element: <OrganizationProfilePage readonly={false} />
}, {
  path: "myOrganization",
  element: <OrganizationProfilePage myOrganization readonly />
}, {
  path: "myOrganization/edit",
  element: <OrganizationProfilePage myOrganization readonly={false} />
}, {
  path: "users",
  element: <UserListPage />
}, {
  path: "users/add",
  element: <UserProfilePage readonly={false} />
}, {
  path: "users/:userId/view",
  element: <UserProfilePage readonly />
}, {
  path: "users/:userId/edit",
  element: <UserProfilePage readonly={false} />
}, {
  path: "myProfil",
  element: <UserProfilePage myProfil readonly />
}, {
  path: "myProfil/edit",
  element: <UserProfilePage myProfil readonly={false} />
}]

const allPages: PageRoute[] = [...imPages]

export const AppRouter = () => {
  const pages = useMemo(() => allPages.map((page) => GenerateRoute(page)), [])
  return (
    <Router>
      <Route path="/" element={<App />} >
        <Route path="" element={"home"} />
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