import {useExtendedAuth} from "components";
import {useMemo} from "react"

export interface UsePoliciesProps {
  myProfil ?: boolean,
  myOrganization?: boolean
}

export const usePolicies = (
  props?: UsePoliciesProps,
) => {
  const { service } = useExtendedAuth()
  const isAdmin = service.is_im_user_write()

  const hasSuperAdminRights = service.is_im_organization_write()

  return useMemo(() => ({
    apiKeys: {
      canfilter: hasSuperAdminRights,
      canDelete: ( hasSuperAdminRights || isAdmin),
      canCreate: ( hasSuperAdminRights || isAdmin),
      canCreateForAllOrg: hasSuperAdminRights,
    },
    organization: {
      canViewlist: hasSuperAdminRights,
      canCreate: hasSuperAdminRights,
      canUpdate: ( hasSuperAdminRights || (isAdmin && props?.myOrganization) ),
      canUpdateRoles: hasSuperAdminRights,
      canDelete: hasSuperAdminRights,
      canVerify: hasSuperAdminRights,
    },
    user: {
      canCreate: ( hasSuperAdminRights || isAdmin || props?.myProfil ),
      canUpdate: ( hasSuperAdminRights || isAdmin || props?.myProfil ),
      canUpdateRole: ( hasSuperAdminRights && !props?.myProfil ),
      canUpdateOrganization: hasSuperAdminRights,
      canDelete: hasSuperAdminRights || isAdmin,
      canListAllUser: hasSuperAdminRights
    }
  }), [service])
}