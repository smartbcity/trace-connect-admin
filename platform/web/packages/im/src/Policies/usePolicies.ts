import {useExtendedAuth} from "components";

export interface UsePoliciesProps {
  myProfil ?: boolean,
  myOrganization?: boolean
}

export const usePolicies = (
  props?: UsePoliciesProps,
) => {
  const { service, keycloak} = useExtendedAuth()
  const isAdmin = service.isAdmin()
  const isSuperAdmin = service.is_super_admin()
  const isOrchestratorAdmin = service.is_tr_orchestrator_admin()

  return {
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
  }
}