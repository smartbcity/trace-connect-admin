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
  const isAdmin = service.isAdmin()
  const isSuperAdmin = service.is_super_admin()
  const isOrchestratorAdmin = service.is_tr_orchestrator_admin()

  const hasSuperAdminRights = isSuperAdmin || isOrchestratorAdmin

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
      canCreate: ( hasSuperAdminRights || props?.myProfil ),
      canUpdate: ( hasSuperAdminRights|| props?.myProfil ),
      canUpdateRole: ( hasSuperAdminRights && !props?.myProfil ),
      canDelete: hasSuperAdminRights,
      canSetSuperAdminRole: isSuperAdmin,
      canListAllUser: hasSuperAdminRights
    }
  }), [service])
}