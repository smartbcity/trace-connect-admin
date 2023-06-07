import { useExtendedAuth } from "components";
import { RequestProps } from "@smartb/g2-utils";
import { useMemo } from "react";
import { i2Config } from '@smartb/g2-providers'


export const useNoAuthenticatedRequest = (): RequestProps => {
  return useMemo(() => ({
    url: i2Config().orgUrl,
  }), [])
}

export const useAuthenticatedRequest = (): RequestProps => {
  const auth = useExtendedAuth()
  return useMemo(() => ({
    url: i2Config().orgUrl,
    jwt: auth.keycloak.token
  }), [auth.keycloak.token])
}
