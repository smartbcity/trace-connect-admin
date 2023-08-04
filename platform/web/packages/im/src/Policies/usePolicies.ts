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

  return useMemo(() => ({
    organization: {
      canCreate: ( isSuperAdmin || isOrchestratorAdmin) ,
      canUpdate: ( isSuperAdmin || (isAdmin && props?.myOrganization) ),
      canDelete: ( isSuperAdmin || isOrchestratorAdmin ),
    },
    user: {
      canCreate: ( isSuperAdmin || isAdmin || props?.myProfil ),
      canUpdate: ( isSuperAdmin || isAdmin || props?.myProfil ),
      canDelete: ( isSuperAdmin || isAdmin || props?.myProfil ),
      canSetSuperAdminRole: isSuperAdmin,
      canListAllUser: service.is_super_admin()
    }
  }), [service])
}