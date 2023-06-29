import {useExtendedAuth} from "components";

export const usePolicies = (
  myProfil ?: boolean,
  myOrganization?: boolean
) => {
  const { service} = useExtendedAuth()
  const isAdmin = service.isAdmin()
  const isSuperAdmin = service.is_super_admin()
  const isOrchestratorAdmin = service.is_tr_orchestrator_admin()

  return {
    organization: {
      canCreate: ( isSuperAdmin || isOrchestratorAdmin) ,
      canUpdate: ( isSuperAdmin || (isAdmin && myOrganization) ),
      canDelete: ( isSuperAdmin || isOrchestratorAdmin ),
    },
    user: {
      canCreate: ( isSuperAdmin || isAdmin || myProfil ),
      canUpdate: ( isSuperAdmin || isAdmin || myProfil ),
      canDelete: ( isSuperAdmin || isAdmin || myProfil ),
      canSetSuperAdminRole: isSuperAdmin,
      canListAllUser: service.is_super_admin()
    }
  }
}